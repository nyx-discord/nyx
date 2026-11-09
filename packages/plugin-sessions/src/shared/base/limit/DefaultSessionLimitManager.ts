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
      for (const policy of policies) {
        for (const rule of policy.rules) {
          await this.checkRule(session, meta, rule);
        }
      }
      this.reserved.set(session.getId(), session);
    });
  }

  /** @inheritdoc */
  public release(session: Session<unknown, Types>): void {
    this.reserved.delete(session.getId());
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

    while (
      current
      && typeof current === 'function'
      && this.policies.has(current as Constructor<Session<unknown, Types>>)
    ) {
      const candidates = this.policies.get(
        current as Constructor<Session<unknown, Types>>,
      )!;

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
    rule: SessionLimitRule<Types>,
  ): Promise<void> {
    const matching = this.getMatchingSessions(session, rule.scope);
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
      // a session that is still starting can't be ended yet
      if (decision.displace.getState() !== SessionStateEnum.Running) {
        throw new SessionLimitExceededError({
          attempted: session,
          existing: matching,
          rule,
        });
      }
      await this.plugin.end(
        decision.displace,
        'Session replaced',
        SessionEndCodes.Displaced,
      );
    }
  }

  /** Finds existing and reserved sessions that share the same scope key as the given session. */
  private getMatchingSessions(
    session: Session<unknown, Types>,
    scope: SessionLimitRule<Types>['scope'],
  ): Session<unknown, Types>[] {
    const repo = this.plugin.getRepository();
    const ctor = session.constructor as Constructor<Session<unknown, Types>>;
    const candidates = new Map(repo.getByConstructor(ctor));
    for (const [id, reserved] of this.reserved) {
      if (reserved.constructor === ctor && !candidates.has(id)) {
        candidates.set(id, reserved);
      }
    }

    const targetKey = this.computeScopeKey(session, scope);
    return [...candidates.values()].filter(
      (s) => s !== session && this.computeScopeKey(s, scope) === targetKey,
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
