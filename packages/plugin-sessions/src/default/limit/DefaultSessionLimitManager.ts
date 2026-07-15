import { SessionEndCodes } from '#src/core/end/SessionEndCodes';
import { AmbiguousSessionLimitError } from '#src/core/limit/errors/AmbiguousSessionLimitError';
import { SessionLimitExceededError } from '#src/core/limit/errors/SessionLimitExceededError';
import type { SessionLimit } from '#src/core/limit/limit/SessionLimit';
import { SessionLimitBuilder } from '#src/core/limit/limit/SessionLimitBuilder';
import type { SessionLimitRule } from '#src/core/limit/rule/SessionLimitRule';
import { SessionLimitScope } from '#src/core/limit/scope/SessionLimitScope';
import type { SessionLimitManager } from '#src/core/limit/SessionLimitManager';
import type { Session } from '#src/core/session/Session';
import type { Constructor } from '@nyx-discord/framework';
import { IllegalStateError } from '@nyx-discord/framework';
import type { SessionPlugin } from '../SessionPlugin';

/** Default implementation of {@link SessionLimitManager}. */
export class DefaultSessionLimitManager implements SessionLimitManager {
  private readonly policies = new Map<
    Constructor<Session<unknown>>,
    SessionLimit[]
  >();

  private readonly plugin: SessionPlugin;

  constructor(plugin: SessionPlugin) {
    this.plugin = plugin;
  }

  /**
   * @inheritdoc
   *
   * @throws {IllegalStateError} If the plugin has already started.
   */
  public register(...limits: (SessionLimit | SessionLimitBuilder)[]): void {
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
  public remove(sessionCtor: Constructor<Session<unknown>>): void {
    this.policies.delete(sessionCtor);
  }

  /** @inheritdoc */
  public getPolicies(): ReadonlyMap<
    Constructor<Session<unknown>>,
    readonly SessionLimit[]
  > {
    return this.policies;
  }

  /**
   * @inheritdoc
   *
   * @throws {SessionLimitExceededError} If the session exceeds a limit with an error action.
   */
  public async checkAndReserve(
    session: Session<unknown>,
    meta: Record<string | symbol, unknown>,
  ): Promise<void> {
    const ctor = session.constructor as Constructor<Session<unknown>>;
    const policies = await this.resolvePolicies(ctor, session, meta);

    for (const policy of policies) {
      for (const rule of policy.rules) {
        await this.checkRule(session, meta, rule);
      }
    }
  }

  /** @inheritdoc */
  public release(_session: Session<unknown>): void {}

  /**
   * Resolves applicable policies for a session by walking the prototype chain.
   *
   * @throws {AmbiguousSessionLimitError} If multiple policies match at the same prototype level without disambiguating predicates.
   */
  private async resolvePolicies(
    ctor: Constructor<Session<unknown>>,
    session: Session<unknown>,
    meta: Record<string | symbol, unknown>,
  ): Promise<SessionLimit[]> {
    const resolved: SessionLimit[] = [];
    let current: Constructor | undefined = ctor;

    while (
      current
      && typeof current === 'function'
      && this.policies.has(current as Constructor<Session<unknown>>)
    ) {
      const candidates = this.policies.get(
        current as Constructor<Session<unknown>>,
      )!;

      const matching: SessionLimit[] = [];
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
    session: Session<unknown>,
    meta: Record<string | symbol, unknown>,
    rule: SessionLimitRule,
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
    session: Session<unknown>,
    scope: SessionLimitRule['scope'],
  ): Session<unknown>[] {
    const repo = this.plugin.getRepository();
    const byCtor = repo.getByConstructor(
      session.constructor as Constructor<Session<unknown>>,
    );
    const targetKey = this.computeScopeKey(session, scope);
    return [...byCtor.values()].filter(
      (s) => this.computeScopeKey(s, scope) === targetKey,
    );
  }

  /** Computes the scope key for a session, delegating to the scope instance or function. */
  private computeScopeKey(
    session: Session<unknown>,
    scope: SessionLimitRule['scope'],
  ): string {
    if (scope instanceof SessionLimitScope) {
      return scope.computeKey(session);
    }
    return scope(session);
  }
}
