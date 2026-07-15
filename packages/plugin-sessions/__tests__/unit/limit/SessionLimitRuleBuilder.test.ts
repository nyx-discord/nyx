import {
  SessionExceedAction,
  SessionLimitRuleBuilder,
  SessionLimitScope,
} from '#src';
import { describe, expect, it } from 'vitest';

describe('SessionLimitRuleBuilder', () => {
  it('defaults to max=1, scope=User, onExceed=Error', () => {
    const rule = new SessionLimitRuleBuilder().toRule();
    expect(rule.max).toBe(1);
    expect(rule.scope).toBe(SessionLimitScope.User);
    expect(rule.onExceed).toBe(SessionExceedAction.Error);
  });

  it('setMax accepts a number', () => {
    expect(new SessionLimitRuleBuilder().setMax(42).toRule().max).toBe(42);
  });

  it('setScope accepts scope instances', () => {
    expect(
      new SessionLimitRuleBuilder().setScope(SessionLimitScope.Guild).toRule()
        .scope,
    ).toBe(SessionLimitScope.Guild);
  });

  it('setScope accepts custom functions', () => {
    const fn = () => 'x';
    const rule = new SessionLimitRuleBuilder().setScope(fn).toRule();
    expect(rule.scope).toBe(fn);
  });

  it('setOnExceed accepts action instances', () => {
    const action = SessionExceedAction.displace();
    const rule = new SessionLimitRuleBuilder().setOnExceed(action).toRule();
    expect(rule.onExceed).toBe(action);
  });

  it('setOnExceed accepts custom action', () => {
    const action = SessionExceedAction.custom(() => ({
      proceed: true,
      displace: null,
    }));
    const rule = new SessionLimitRuleBuilder().setOnExceed(action).toRule();
    expect(rule.onExceed).toBe(action);
  });

  it('supports chaining all setters', () => {
    const rule = new SessionLimitRuleBuilder()
      .setMax(3)
      .setScope(SessionLimitScope.Guild)
      .setOnExceed(SessionExceedAction.Error)
      .toRule();
    expect(rule.max).toBe(3);
    expect(rule.scope).toBe(SessionLimitScope.Guild);
    expect(rule.onExceed).toBe(SessionExceedAction.Error);
  });
});
