import { SessionLimitScope } from '#src';
import type { SessionStartInteraction, Session } from '#src';
import { describe, expect, it } from 'vitest';

function makeSession(
  userId: string,
  guildId: string | null,
  channelId: string | null,
): Session<unknown> {
  return {
    getStartInteraction: () =>
      ({
        user: { id: userId },
        guildId,
        channelId,
      }) as unknown as SessionStartInteraction,
  } as unknown as Session<unknown>;
}

describe('SessionLimitScope', () => {
  describe('User', () => {
    it('returns the user id', () => {
      const s = makeSession('user-1', 'guild-1', 'channel-1');
      expect(SessionLimitScope.User.computeKey(s)).toBe('user-1');
    });

    it('returns different keys for different users', () => {
      const a = makeSession('alice', 'guild-1', 'channel-1');
      const b = makeSession('bob', 'guild-1', 'channel-1');
      expect(SessionLimitScope.User.computeKey(a)).toBe('alice');
      expect(SessionLimitScope.User.computeKey(b)).toBe('bob');
    });
  });

  describe('Guild', () => {
    it('returns the guild id', () => {
      const s = makeSession('user-1', 'guild-42', 'channel-1');
      expect(SessionLimitScope.Guild.computeKey(s)).toBe('guild-42');
    });

    it("returns 'dm' when guildId is null", () => {
      const s = makeSession('user-1', null, 'channel-1');
      expect(SessionLimitScope.Guild.computeKey(s)).toBe('dm');
    });
  });

  describe('Channel', () => {
    it('returns the channel id', () => {
      const s = makeSession('user-1', 'guild-1', 'channel-77');
      expect(SessionLimitScope.Channel.computeKey(s)).toBe('channel-77');
    });

    it("returns 'unknown' when channelId is null", () => {
      const s = makeSession('user-1', 'guild-1', null);
      expect(SessionLimitScope.Channel.computeKey(s)).toBe('unknown');
    });
  });

  describe('composite', () => {
    it('joins user and guild with colon', () => {
      const s = makeSession('alice', 'guild-x', 'channel-1');
      const scope = SessionLimitScope.composite(
        SessionLimitScope.User,
        SessionLimitScope.Guild,
      );
      expect(scope.computeKey(s)).toBe('alice:guild-x');
    });

    it('joins user, guild, and channel with colons (sorted)', () => {
      const s = makeSession('alice', 'guild-x', 'channel-y');
      const scope = SessionLimitScope.composite(
        SessionLimitScope.User,
        SessionLimitScope.Guild,
        SessionLimitScope.Channel,
      );
      expect(scope.computeKey(s)).toBe('alice:channel-y:guild-x');
    });

    it('uses dm for null guildId in composite', () => {
      const s = makeSession('alice', null, 'channel-1');
      const scope = SessionLimitScope.composite(
        SessionLimitScope.User,
        SessionLimitScope.Guild,
      );
      expect(scope.computeKey(s)).toBe('alice:dm');
    });
  });

  describe('custom', () => {
    it('uses the provided key function', () => {
      const scope = SessionLimitScope.custom(
        (session) => `custom-${session.getStartInteraction().user.id}`,
      );
      const s = makeSession('user-99', 'guild-1', 'channel-1');
      expect(scope.computeKey(s)).toBe('custom-user-99');
    });
  });
});
