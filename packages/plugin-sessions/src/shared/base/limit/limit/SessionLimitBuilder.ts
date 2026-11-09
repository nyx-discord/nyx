import type {
  Awaitable,
  Constructor,
  InteractionTypes,
} from '@nyx-discord/base';
import type { SessionLimit } from '../../../types/limit/limit/SessionLimit.js';
import type { SessionLimitRule } from '../../../types/limit/rule/SessionLimitRule.js';
import type { Session } from '../../../types/session/Session.js';
import type { SessionLimitRuleBuilderCallback } from '../rule/SessionLimitRuleBuilder.js';
import { SessionLimitRuleBuilder } from '../rule/SessionLimitRuleBuilder.js';

/** Builder for constructing {@link SessionLimit} instances fluently. */
export class SessionLimitBuilder<
  Types extends InteractionTypes = InteractionTypes,
> {
  protected session?: Constructor<Session<unknown, Types>>;

  protected predicate?: SessionLimit<Types>['predicate'];

  protected readonly rules: SessionLimitRule<Types>[] = [];

  /** Sets the session constructor this limit applies to, including its subclasses. */
  public setSession(ctor: Constructor<Session<unknown, Types>>): this {
    this.session = ctor;
    return this;
  }

  /** Sets a predicate to conditionally apply this limit based on the session and its metadata. */
  public setPredicate(
    predicate: (
      session: Session<unknown, Types>,
      meta: Record<string | symbol, unknown>,
    ) => Awaitable<boolean>,
  ): this {
    this.predicate = predicate;
    return this;
  }

  /** Adds a rule to this limit policy. Accepts a plain rule object, a builder, or a callback. */
  public addRule(
    rule:
      | SessionLimitRule<Types>
      | SessionLimitRuleBuilder<Types>
      | SessionLimitRuleBuilderCallback<Types>,
  ): this {
    if (typeof rule === 'function') {
      const builder = new SessionLimitRuleBuilder<Types>();
      const result = rule(builder);
      if (result instanceof SessionLimitRuleBuilder) {
        this.rules.push(result.toRule());
      } else {
        this.rules.push(result);
      }
    } else if (rule instanceof SessionLimitRuleBuilder) {
      this.rules.push(rule.toRule());
    } else {
      this.rules.push(rule);
    }
    return this;
  }

  /**
   * Builds and returns the {@link SessionLimit} instance.
   *
   * @throws {Error} If no session constructor was set.
   */
  public toSessionLimit(): SessionLimit<Types> {
    if (!this.session) {
      throw new Error('Session constructor must be set before building.');
    }
    return {
      session: this.session,
      rules: [...this.rules],
      predicate: this.predicate,
    };
  }
}
