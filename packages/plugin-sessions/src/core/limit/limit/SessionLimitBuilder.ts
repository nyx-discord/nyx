import type { SessionLimitRuleBuilderCallback } from '#src/core/limit/rule/SessionLimitRuleBuilder';
import { SessionLimitRuleBuilder } from '#src/core/limit/rule/SessionLimitRuleBuilder';
import type { Constructor } from '@nyx-discord/framework';
import type { Awaitable } from 'discord.js';
import type { Session } from '../../session/Session';
import type { SessionLimitRule } from '../rule/SessionLimitRule';
import type { SessionLimit } from './SessionLimit';

/** Builder for constructing {@link SessionLimit} instances fluently. */
export class SessionLimitBuilder {
  private session?: Constructor<Session<unknown>>;

  private predicate?: SessionLimit['predicate'];

  private readonly rules: SessionLimitRule[] = [];

  public setSession(ctor: Constructor<Session<unknown>>): this {
    this.session = ctor;
    return this;
  }

  public setPredicate(
    predicate: (
      session: Session<unknown>,
      meta: Record<string | symbol, unknown>,
    ) => Awaitable<boolean>,
  ): this {
    this.predicate = predicate;
    return this;
  }

  /** Adds a rule to this limit policy. Accepts a plain rule object, a builder, or a callback. */
  public addRule(rule: SessionLimitRule | SessionLimitRuleBuilder): this;

  public addRule(cb: SessionLimitRuleBuilderCallback): this;

  public addRule(
    rule:
      | SessionLimitRule
      | SessionLimitRuleBuilder
      | SessionLimitRuleBuilderCallback,
  ): this {
    if (typeof rule === 'function') {
      const builder = new SessionLimitRuleBuilder();
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
  public toSessionLimit(): SessionLimit {
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
