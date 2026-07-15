import {
  SessionLimitBuilder,
  SessionLimitRuleBuilder,
  SessionLimitScope,
  SessionExceedAction,
} from '#src';
import { describe, expect, it } from 'vitest';
import { MockSession } from '#mocks/MockSession';

describe('SessionLimitBuilder', () => {
  it('builds from a rule builder instance', () => {
    const limit = new SessionLimitBuilder()
      .setSession(MockSession)
      .addRule(
        new SessionLimitRuleBuilder()
          .setMax(1)
          .setScope(SessionLimitScope.User)
          .setOnExceed(SessionExceedAction.displace()),
      )
      .toSessionLimit();

    expect(limit.rules[0]!.max).toBe(1);
    expect(limit.rules[0]!.scope).toBe(SessionLimitScope.User);
    expect(limit.rules[0]!.onExceed).toBeInstanceOf(SessionExceedAction);
  });

  it('builds from a callback receiving a builder', () => {
    const limit = new SessionLimitBuilder()
      .setSession(MockSession)
      .addRule((rule) =>
        rule
          .setMax(5)
          .setScope(SessionLimitScope.Channel)
          .setOnExceed(SessionExceedAction.Error),
      )
      .toSessionLimit();

    expect(limit.rules[0]!.max).toBe(5);
    expect(limit.rules[0]!.scope).toBe(SessionLimitScope.Channel);
  });

  it('builds from a callback returning a plain object', () => {
    const limit = new SessionLimitBuilder()
      .setSession(MockSession)
      .addRule(() => ({
        max: 7,
        scope: SessionLimitScope.User,
        onExceed: SessionExceedAction.displace(),
      }))
      .toSessionLimit();

    expect(limit.rules[0]!.max).toBe(7);
  });

  it('throws when setSession was not called', () => {
    const builder = new SessionLimitBuilder().addRule(
      new SessionLimitRuleBuilder(),
    );
    expect(() => builder.toSessionLimit()).toThrow(
      'Session constructor must be set',
    );
  });

  it('supports multiple rules via chained addRule calls', () => {
    const limit = new SessionLimitBuilder()
      .setSession(MockSession)
      .addRule(
        new SessionLimitRuleBuilder()
          .setMax(1)
          .setScope(SessionLimitScope.User)
          .setOnExceed(SessionExceedAction.displace()),
      )
      .addRule(
        new SessionLimitRuleBuilder()
          .setMax(10)
          .setScope(SessionLimitScope.Guild)
          .setOnExceed(SessionExceedAction.Error),
      )
      .toSessionLimit();

    expect(limit.rules).toHaveLength(2);
  });

  it('accepts a predicate', () => {
    const predicate = () => true;
    const limit = new SessionLimitBuilder()
      .setSession(MockSession)
      .setPredicate(predicate)
      .toSessionLimit();

    expect(limit.predicate).toBe(predicate);
  });
});
