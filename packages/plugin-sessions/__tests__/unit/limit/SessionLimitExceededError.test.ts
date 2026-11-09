import {
  SessionExceedAction,
  SessionLimitExceededError,
  SessionLimitRuleBuilder,
  SessionLimitScope,
} from '#src';
import { MockSession } from '#mocks/MockSession';
import { describe, expect, it } from 'vitest';
import { getTestBot } from '../../testBot';

describe('SessionLimitExceededError', () => {
  it('stores attempted, existing, and rule', async () => {
    const bot = await getTestBot();
    const session = MockSession.withInteraction(bot);
    const existing = [MockSession.withInteraction(bot)];
    const rule = new SessionLimitRuleBuilder()
      .setMax(1)
      .setScope(SessionLimitScope.User)
      .setOnExceed(SessionExceedAction.Error)
      .toRule();

    const error = new SessionLimitExceededError({
      attempted: session,
      existing,
      rule,
    });

    expect(error.attempted).toBe(session);
    expect(error.existing).toBe(existing);
    expect(error.rule).toBe(rule);
    expect(error.message).toBe('Session limit exceeded.');
    expect(error).toBeInstanceOf(Error);
  });
});
