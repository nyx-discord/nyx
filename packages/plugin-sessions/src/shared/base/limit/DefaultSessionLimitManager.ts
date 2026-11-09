import type { Constructor, InteractionTypes } from '@nyx-discord/base';
import { IllegalStateError } from '@nyx-discord/base';
import { SessionEndCodes } from '../../types/end/SessionEndCodes.js';
import { AmbiguousSessionLimitError } from '../../types/limit/errors/AmbiguousSessionLimitError.js';
import { SessionLimitExceededError } from '../../types/limit/errors/SessionLimitExceededError.js';
import type { SessionLimit } from '../../types/limit/limit/SessionLimit.js';
import type { SessionLimitRule } from '../../types/limit/rule/SessionLimitRule.js';
import type { SessionLimitManager } from '../../types/limit/SessionLimitManager.js';
import type { Session } from '../../types/session/Session.js';
import { SessionStateEnum } from '../../types/state/SessionState.js';
import type { BaseSessionPlugin } from '../plugin/BaseSessionPlugin.js';
import { SessionLimitBuilder } from './limit/SessionLimitBuilder.js';
import { SessionLimitScope } from './scope/SessionLimitScope.js';

/** Default implementation of {@link SessionLimitManager}. */
export class DefaultSessionLimitManager<
  Types extends InteractionTypes = InteractionTypes,
> implements SessionLimitManager<Types> {
  private readonly policies = new Map<
    Constructor<Session<unknown, Types>>,
    SessionLimit<Types>[]
  >();

  private readonly plugin: BaseSessionPlugin<Types>;

  /** Sessions that passed their limits and haven't ended yet, counted even before the repository saves them. */
  protected readonly reserved = new Map<string, Session<unknown, Types>>();

  /** Sessions to displace once the session that displaces them (the key) has started. */
  protected readonly displacements = new Map<
    string,
    Session<unknown, Types>[]
  >();

  /** IDs of sessions waiting to be displaced, which no longer count towards limits. */
  protected readonly displacing = new Set<string>();

  /** Serializes limit checks, so a session can't pass while another one is displacing. */
  protected lock: Promise<void> = Promise.resolve();

  constructor(plugin: BaseSessionPlugin<Types>) {
    this.plugin = plugin;
  }

  /**
   * @inheritdoc
   *
   * @throws {IllegalStateError} If the plugin has already started.
   */
  public register(
    ...limits: (SessionLimit<Types> | SessionLimitBuilder<Types>)[]
  ): void {
    if (this.plugin.isRunning()) {
      throw new IllegalStateError(
        'Cannot register session limits after the plugin has started.',
      );
    }
    for (const input of limits) {
      const limit =
        input instanceof SessionLimitBuilder ? input.toSessionLimit() : input;
      const arr = this.policies.get(limit.session);
      if (arr) {
        arr.push(limit);
      } else {
        this.policies.set(limit.session, [limit]);
      }
    }
  }

  /** @inheritdoc */
  public remove(sessionCtor: Constructor<Session<unknown, Types>>): void {
    this.policies.delete(sessionCtor);
  }

  /** @inheritdoc */
  public getPolicies(): ReadonlyMap<
    Constructor<Session<unknown, Types>>,
    readonly SessionLimit<Types>[]
  > {
    return this.policies;
  }

  /**
   * @inheritdoc
   *
   * @throws {SessionLimitExceededError} If the session exceeds a limit with an error action.
   */
  public async checkAndReserve(
    session: Session<unknown, Types>,
    meta: Record<string | symbol, unknown>,
  ): Promise<void> {
    const ctor = session.constructor as Constructor<Session<unknown, Types>>;
    const policies = await this.resolvePolicies(ctor, session, meta);
    if (policies.length === 0) return;

    await this.withLock(async () => {
      try {
        for (const policy of policies) {
          for (const rule of policy.rules) {
            await this.checkRule(session, meta, policy, rule);
          }
        }
      } catch (error) {
        this.cancelDisplacements(session);
        throw error;
      }
      this.reserved.set(session.getId(), session);
    });
  }

  /** @inheritdoc */
  public async commit(session: Session<unknown, Types>): Promise<void> {
    const targets = this.displacements.get(session.getId()) ?? [];
    this.displacements.delete(session.getId());

    for (const target of targets) {
      this.displacing.delete(target.getId());
      // it may have ended or expired while the new session was starting
      if (
        target.getState() !== SessionStateEnum.Running
        || !this.plugin.getRepository().has(target.getId())
      ) {
        continue;
      }

      await this.plugin.end(
        target,
        'Session replaced',
        SessionEndCodes.Displaced,
      );
    }
  }

  /** @inheritdoc */
  public release(session: Session<unknown, Types>): void {
    this.reserved.delete(session.getId());
    this.cancelDisplacements(session);
  }

  /** Keeps running the sessions that the given session was going to displace. */
  protected cancelDisplacements(session: Session<unknown, Types>): void {
    const targets = this.displacements.get(session.getId()) ?? [];
    for (const target of targets) {
      this.displacing.delete(target.getId());
    }
    this.displacements.delete(session.getId());
  }

  /** Runs the given function once every previous call has finished. */
  protected async withLock<T>(fn: () => Promise<T>): Promise<T> {
    const previous = this.lock;
    let unlock!: () => void;
    this.lock = new Promise((resolve) => {
      unlock = resolve;
    });

    await previous;
    try {
      return await fn();
    } finally {
      unlock();
    }
  }

  /**
   * Resolves applicable policies for a session by walking the prototype chain.
   *
   * @throws {AmbiguousSessionLimitError} If multiple policies match at the same prototype level without disambiguating predicates.
   */
  private async resolvePolicies(
    ctor: Constructor<Session<unknown, Types>>,
    session: Session<unknown, Types>,
    meta: Record<string | symbol, unknown>,
  ): Promise<SessionLimit<Types>[]> {
    const resolved: SessionLimit<Types>[] = [];
    let current: Constructor | undefined = ctor;

    while (current && current !== Object) {
      const candidates =
        this.policies.get(current as Constructor<Session<unknown, Types>>)
        ?? [];

      const matching: SessionLimit<Types>[] = [];
      for (const candidate of candidates) {
        if (!candidate.predicate) {
          matching.push(candidate);
        } else if (await candidate.predicate(session, meta)) {
          matching.push(candidate);
        }
      }

      if (matching.length > 1) {
        throw new AmbiguousSessionLimitError(current, matching);
      }
      if (matching.length === 1) {
        resolved.push(matching[0]!);
      }

      const proto = Object.getPrototypeOf(current.prototype);
      current = proto?.constructor as Constructor | undefined;
    }

    return resolved;
  }

  /**
   * Checks a single limit rule against the current session.
   *
   * @throws {SessionLimitExceededError} If the limit is exceeded and the action prevents proceeding.
   */
  private async checkRule(
    session: Session<unknown, Types>,
    meta: Record<string | symbol, unknown>,
    policy: SessionLimit<Types>,
    rule: SessionLimitRule<Types>,
  ): Promise<void> {
    const matching = this.getMatchingSessions(
      session,
      policy.session,
      rule.scope,
    );
    if (matching.length < rule.max) return;

    const decision = await rule.onExceed.decide({
      attempted: session,
      existing: matching,
      rule,
      meta,
    });

    if (!decision.proceed) {
      throw new SessionLimitExceededError({
        attempted: session,
        existing: matching,
        rule,
      });
    }
    if (decision.displace) {
      const target = decision.displace;
      // a session that is still starting can't be ended, and one already being displaced frees no slot
      if (
        target.getState() !== SessionStateEnum.Running
        || this.displacing.has(target.getId())
      ) {
        throw new SessionLimitExceededError({
          attempted: session,
          existing: matching,
          rule,
        });
      }

      // ended in commit(), once the attempted session has started
      this.displacing.add(target.getId());
      const targets = this.displacements.get(session.getId()) ?? [];
      targets.push(target);
      this.displacements.set(session.getId(), targets);
    }
  }

  /** Finds existing and reserved sessions of the policy's constructor (or its subclasses) that share the same scope key as the given session, ignoring those being displaced. */
  private getMatchingSessions(
    session: Session<unknown, Types>,
    policyCtor: Constructor<Session<unknown, any>>,
    scope: SessionLimitRule<Types>['scope'],
  ): Session<unknown, Types>[] {
    const repo = this.plugin.getRepository();
    const candidates = new Map(
      repo.getByConstructor(policyCtor as Constructor<Session<unknown, Types>>),
    );
    for (const [id, reserved] of this.reserved) {
      if (reserved instanceof policyCtor && !candidates.has(id)) {
        candidates.set(id, reserved);
      }
    }

    const targetKey = this.computeScopeKey(session, scope);
    return [...candidates.values()].filter(
      (s) =>
        s !== session
        && !this.displacing.has(s.getId())
        && this.computeScopeKey(s, scope) === targetKey,
    );
  }

  /** Computes the scope key for a session, delegating to the scope instance or function. */
  private computeScopeKey(
    session: Session<unknown, Types>,
    scope: SessionLimitRule<Types>['scope'],
  ): string {
    if (scope instanceof SessionLimitScope) {
      return scope.computeKey(session);
    }
    return scope(session);
  }
}
