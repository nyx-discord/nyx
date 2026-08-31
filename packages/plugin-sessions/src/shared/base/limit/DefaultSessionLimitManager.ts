import type { Constructor, InteractionTypes } from '@nyx-discord/types';
import { IllegalStateError } from '@nyx-discord/types';
import { SessionEndCodes } from '../../types/end/SessionEndCodes.js';
import { AmbiguousSessionLimitError } from '../../types/limit/errors/AmbiguousSessionLimitError.js';
import { SessionLimitExceededError } from '../../types/limit/errors/SessionLimitExceededError.js';
import type { SessionLimit } from '../../types/limit/limit/SessionLimit.js';
import { SessionLimitBuilder } from './limit/SessionLimitBuilder.js';
import type { SessionLimitRule } from '../../types/limit/rule/SessionLimitRule.js';
import { SessionLimitScope } from './scope/SessionLimitScope.js';
import type { SessionLimitManager } from '../../types/limit/SessionLimitManager.js';
import type { Session } from '../../types/session/Session.js';
import type { BaseSessionPlugin } from '../plugin/BaseSessionPlugin.js';

/** Default implementation of {@link SessionLimitManager}. */
export class DefaultSessionLimitManager<
  Types extends InteractionTypes = InteractionTypes,
> implements SessionLimitManager<Types> {
  private readonly policies = new Map<
    Constructor<Session<unknown, Types>>,
    SessionLimit<Types>[]
  >();

  private readonly plugin: BaseSessionPlugin<Types>;

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

    for (const policy of policies) {
      for (const rule of policy.rules) {
        await this.checkRule(session, meta, rule);
      }
    }
  }

  /** @inheritdoc */
  public release(_session: Session<unknown, Types>): void {}

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
      await this.plugin.end(
        decision.displace,
        'Session replaced',
        SessionEndCodes.Displaced,
      );
    }
  }

  /** Finds existing sessions that share the same scope key as the given session. */
  private getMatchingSessions(
    session: Session<unknown, Types>,
    scope: SessionLimitRule<Types>['scope'],
  ): Session<unknown, Types>[] {
    const repo = this.plugin.getRepository();
    const byCtor = repo.getByConstructor(
      session.constructor as Constructor<Session<unknown, Types>>,
    );
    const targetKey = this.computeScopeKey(session, scope);
    return [...byCtor.values()].filter(
      (s) => this.computeScopeKey(s, scope) === targetKey,
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
