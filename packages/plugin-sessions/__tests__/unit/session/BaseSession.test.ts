import { AssertionError } from '@nyx-discord/types';
import { describe, expect, test } from 'vitest';
import { DjsSessionPlugin } from '#src';
import { MockSession } from '#mocks/MockSession';
import { getTestBot } from '../../testBot';

describe('BaseSession', () => {
  describe('setState', () => {
    describe('valid transitions', () => {
      test('GIVEN uninitialized session WHEN state set to running THEN succeeds', async () => {
        const session = await MockSession.createMock();
        expect(() => session.setState('running')).not.toThrow();
        expect(session.getState()).toBe('running');
      });

      test('GIVEN running session WHEN state set to ended THEN succeeds', async () => {
        const session = await MockSession.createMock();
        session.setState('running');
        expect(() => session.setState('ended')).not.toThrow();
        expect(session.getState()).toBe('ended');
      });

      test('GIVEN uninitialized session WHEN state set to uninitialized THEN succeeds as no-op', async () => {
        const session = await MockSession.createMock();
        expect(() => session.setState('uninitialized')).not.toThrow();
        expect(session.getState()).toBe('uninitialized');
      });
    });

    describe('invalid transitions throw AssertionError', () => {
      test('GIVEN running session WHEN state set to uninitialized THEN throws AssertionError', async () => {
        const session = await MockSession.createMock();
        session.setState('running');
        expect(() => session.setState('uninitialized')).toThrow(AssertionError);
      });

      test('GIVEN uninitialized session WHEN state set to ended THEN throws AssertionError', async () => {
        const session = await MockSession.createMock();
        expect(() => session.setState('ended')).toThrow(AssertionError);
      });

      test('GIVEN ended session WHEN state set to running THEN throws AssertionError', async () => {
        const session = await MockSession.createMock();
        session.setState('running');
        session.setState('ended');
        expect(() => session.setState('running')).toThrow(AssertionError);
      });

      test('GIVEN ended session WHEN state set to ended THEN throws AssertionError', async () => {
        const session = await MockSession.createMock();
        session.setState('running');
        session.setState('ended');
        expect(() => session.setState('ended')).toThrow(AssertionError);
      });

      test('GIVEN ended session WHEN state set to uninitialized THEN throws AssertionError', async () => {
        const session = await MockSession.createMock();
        session.setState('running');
        session.setState('ended');
        expect(() => session.setState('uninitialized')).toThrow(AssertionError);
      });
    });
  });

  describe('getTTL', () => {
    test('GIVEN a custom ttl THEN returns the overridden value', async () => {
      const bot = await getTestBot();
      const session = new MockSession({
        bot,
        id: 'ttl-test',
        startInteraction: {} as any,
        ttl: 5000,
      });
      expect(session.getTTL()).toBe(5000);
    });
  });

  describe('getCustomIdData', () => {
    test('GIVEN no extra THEN returns base data with extra: null', async () => {
      const session = await MockSession.createMock();
      const data = session.getCustomIdData();
      expect(data).toEqual({ id: session.getId(), extra: null, page: null });
    });

    test('GIVEN extra THEN returns data with the given extra', async () => {
      const session = await MockSession.createMock();
      const data = session.getCustomIdData('test-extra');
      expect(data).toEqual({ id: session.getId(), extra: 'test-extra', page: null });
    });

    test('GIVEN extra THEN does not mutate the base customId data', async () => {
      const session = await MockSession.createMock();
      session.getCustomIdData('mutate-test');
      expect(session.getCustomIdData()).toEqual({ id: session.getId(), extra: null, page: null });
    });
  });

  describe('buildCustomId', () => {
    test('GIVEN no extra THEN produces a string decodable by the codec with matching data', async () => {
      const session = await MockSession.createMock();
      const bot = session.getBot();
      const codec = DjsSessionPlugin.getFromBot(bot).getCustomIdCodec();

      const built = session.buildCustomId();
      const decoded = codec.deserialize(built);

      expect(decoded).toEqual({ id: session.getId(), extra: null, page: null });
    });

    test('GIVEN an extra THEN codec round-trip includes the extra', async () => {
      const session = await MockSession.createMock();
      const bot = session.getBot();
      const codec = DjsSessionPlugin.getFromBot(bot).getCustomIdCodec();

      const built = session.buildCustomId('my-extra');
      const decoded = codec.deserialize(built);

      expect(decoded).toEqual({ id: session.getId(), extra: 'my-extra', page: null });
    });

    test('GIVEN extra THEN does not mutate the base customId data', async () => {
      const session = await MockSession.createMock();
      session.buildCustomId('side-effect');
      expect(session.getCustomIdData()).toEqual({ id: session.getId(), extra: null, page: null });
    });
  });

  describe('identity accessors', () => {
    test('GIVEN start interaction with userId THEN getUserId returns the user id', async () => {
      const bot = await getTestBot();
      const session = MockSession.withInteraction(bot, { userId: 'user-42' });
      expect(session.getUserId()).toBe('user-42');
    });

    test('GIVEN start interaction with guildId THEN getGuildId returns the guild id', async () => {
      const bot = await getTestBot();
      const session = MockSession.withInteraction(bot, { guildId: 'guild-99' });
      expect(session.getGuildId()).toBe('guild-99');
    });

    test('GIVEN start interaction with null guildId THEN getGuildId returns null for DMs', async () => {
      const bot = await getTestBot();
      const session = new MockSession({
        bot,
        id: 'dm-session',
        startInteraction: {
          user: { id: 'user-1' },
          guildId: null,
          channelId: 'channel-1',
          replied: false,
        } as any,
      });
      expect(session.getGuildId()).toBeNull();
    });

    test('GIVEN start interaction with channelId THEN getChannelId returns the channel id', async () => {
      const bot = await getTestBot();
      const session = MockSession.withInteraction(bot, { channelId: 'channel-7' });
      expect(session.getChannelId()).toBe('channel-7');
    });

    test('GIVEN start interaction with replied flag THEN hasReplied reflects the start interaction replied flag', async () => {
      const bot = await getTestBot();
      const session = MockSession.withInteraction(bot);
      expect(session.hasReplied()).toBe(false);
    });
  });
});

