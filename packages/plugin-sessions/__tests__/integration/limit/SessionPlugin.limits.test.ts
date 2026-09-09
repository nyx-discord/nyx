import { MockSession } from '#mocks/MockSession';
import {
  SessionEndCodes,
  SessionExceedAction,
  SessionLimitExceededError,
  SessionLimitScope,
  DjsSessionPlugin,
} from '#src';
import type { Metadata, NyxBot } from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import { beforeAll, describe, expect, test } from 'vitest';
import { getTestBot } from '../../testBot';

const Tier = TypedFields.create<'premium' | 'free'>('Tier');

let bot: NyxBot;

const makeSess = (overrides?: {
  userId?: string;
  guildId?: string | null;
  channelId?: string;
}) => MockSession.withInteraction(bot, overrides);

beforeAll(async () => {
  bot = await getTestBot();
});

const AE = SessionExceedAction;
const Scope = SessionLimitScope;

describe('SessionPlugin integration', () => {
  describe('scope: User', () => {
    test('GIVEN different users independently THEN allows each session', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.User, onExceed: AE.Error }],
      });

      await expect(plugin.start(makeSess({ userId: 'alice' }))).resolves.toBe(
        true,
      );
      await expect(plugin.start(makeSess({ userId: 'bob' }))).resolves.toBe(
        true,
      );
    });

    test('GIVEN the same user when max=1 THEN blocks the second session with SessionLimitExceededError', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.User, onExceed: AE.Error }],
      });

      await plugin.start(makeSess({ userId: 'u' }));
      await expect(plugin.start(makeSess({ userId: 'u' }))).rejects.toThrow(
        SessionLimitExceededError,
      );
    });
  });

  describe('scope: Guild', () => {
    test('GIVEN different guilds independently THEN allows each session', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.Guild, onExceed: AE.Error }],
      });

      await expect(
        plugin.start(makeSess({ guildId: 'guild-a' })),
      ).resolves.toBe(true);
      await expect(
        plugin.start(makeSess({ guildId: 'guild-b' })),
      ).resolves.toBe(true);
    });

    test('GIVEN the same guild when max=1 THEN blocks the second session with SessionLimitExceededError', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.Guild, onExceed: AE.Error }],
      });

      await plugin.start(makeSess({ guildId: 'guild-x' }));
      await expect(
        plugin.start(makeSess({ guildId: 'guild-x' })),
      ).rejects.toThrow(SessionLimitExceededError);
    });

    test("GIVEN null guildId THEN treats as 'dm' and blocks second DM session", async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.Guild, onExceed: AE.Error }],
      });

      await plugin.start(makeSess({ guildId: null }));
      await expect(
        plugin.start(makeSess({ guildId: null })),
      ).rejects.toThrow(SessionLimitExceededError);
    });
  });

  describe('scope: Channel', () => {
    test('GIVEN the same channel when max=1 THEN blocks the second session with SessionLimitExceededError', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.Channel, onExceed: AE.Error }],
      });

      await plugin.start(makeSess({ channelId: 'chan-42' }));
      await expect(
        plugin.start(makeSess({ channelId: 'chan-42' })),
      ).rejects.toThrow(SessionLimitExceededError);
    });

    test('GIVEN different channels independently THEN allows each session', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.Channel, onExceed: AE.Error }],
      });

      await expect(plugin.start(makeSess({ channelId: 'c1' }))).resolves.toBe(
        true,
      );
      await expect(plugin.start(makeSess({ channelId: 'c2' }))).resolves.toBe(
        true,
      );
    });
  });

  describe('scope: composite', () => {
    test('GIVEN same user in same guild THEN blocks; GIVEN different user or guild THEN allows', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: Scope.composite(Scope.User, Scope.Guild),
            onExceed: AE.Error,
          },
        ],
      });

      await plugin.start(makeSess({ userId: 'alice', guildId: 'guild-x' }));

      await expect(
        plugin.start(makeSess({ userId: 'alice', guildId: 'guild-x' })),
      ).rejects.toThrow(SessionLimitExceededError);

      await expect(
        plugin.start(makeSess({ userId: 'bob', guildId: 'guild-x' })),
      ).resolves.toBe(true);
    });
  });

  describe('scope: custom', () => {
    test('GIVEN a custom key function THEN uses it to partition limit groups', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: Scope.custom((s) =>
              s.getStartInteraction().user.id.slice(0, 3),
            ),
            onExceed: AE.Error,
          },
        ],
      });

      await plugin.start(makeSess({ userId: 'abc-123' }));
      await expect(
        plugin.start(makeSess({ userId: 'abc-456' })),
      ).rejects.toThrow(SessionLimitExceededError);
      await expect(plugin.start(makeSess({ userId: 'xyz-789' }))).resolves.toBe(
        true,
      );
    });
  });

  describe('action: displace', () => {
    test('GIVEN max=1 and onExceed displace THEN terminates oldest session and starts the new one', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.User, onExceed: AE.displace() }],
      });

      const first = makeSess({ userId: 'u' });
      await plugin.start(first);

      const second = makeSess({ userId: 'u' });
      const result = await plugin.start(second);

      expect(result).toBe(true);
      expect(first.getState()).toBe('ended');
      expect(second.getState()).toBe('running');
    });

    test('GIVEN max=2 and a 3rd session starts with displace action THEN displaces only the oldest session', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 2, scope: Scope.User, onExceed: AE.displace() }],
      });

      const first = makeSess({ userId: 'u' });
      await plugin.start(first);

      const second = makeSess({ userId: 'u' });
      await plugin.start(second);

      const third = makeSess({ userId: 'u' });
      const result = await plugin.start(third);

      expect(result).toBe(true);
      expect(first.getState()).toBe('ended');
      expect(second.getState()).toBe('running');
      expect(third.getState()).toBe('running');
    });
  });

  describe('session termination releasing slots', () => {
    test('GIVEN an ended session THEN limit slot is freed for a new session', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.User, onExceed: AE.Error }],
      });

      const first = makeSess({ userId: 'alice' });
      await plugin.start(first);

      const second = makeSess({ userId: 'alice' });
      await expect(plugin.start(second)).rejects.toThrow(
        SessionLimitExceededError,
      );

      await plugin.end(first, 'User finished', SessionEndCodes.SelfEnded);
      expect(first.getState()).toBe('ended');

      const third = makeSess({ userId: 'alice' });
      await expect(plugin.start(third)).resolves.toBe(true);
      expect(third.getState()).toBe('running');
    });

    test('GIVEN an expired session via TTL THEN limit slot is freed for a new session', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [{ max: 1, scope: Scope.User, onExceed: AE.Error }],
      });

      const shortTtlSession = new MockSession({
        bot,
        id: 'expiring-session',
        startInteraction: {
          user: { id: 'alice' },
          guildId: 'guild-1',
          channelId: 'channel-1',
          replied: false,
        } as any,
        ttl: 20,
      });

      await plugin.start(shortTtlSession);

      // Wait for the session TTL to expire in the repository
      await new Promise((resolve) => setTimeout(resolve, 50));

      const newSession = makeSess({ userId: 'alice' });
      await expect(plugin.start(newSession)).resolves.toBe(true);
      expect(newSession.getState()).toBe('running');
    });
  });

  describe('multiple concurrent rules', () => {
    test('GIVEN multiple registered rules across different scopes THEN enforces all rules simultaneously', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          { max: 1, scope: Scope.User, onExceed: AE.Error },
          { max: 2, scope: Scope.Guild, onExceed: AE.Error },
        ],
      });

      // User alice in guild-1: allowed (1/1 user, 1/2 guild)
      await expect(
        plugin.start(makeSess({ userId: 'alice', guildId: 'guild-1' })),
      ).resolves.toBe(true);

      // User alice in guild-2: blocked by User rule (user already has 1 session)
      await expect(
        plugin.start(makeSess({ userId: 'alice', guildId: 'guild-2' })),
      ).rejects.toThrow(SessionLimitExceededError);

      // User bob in guild-1: allowed (1/1 bob, 2/2 guild)
      await expect(
        plugin.start(makeSess({ userId: 'bob', guildId: 'guild-1' })),
      ).resolves.toBe(true);

      // User charlie in guild-1: blocked by Guild rule (guild-1 has 2/2 sessions)
      await expect(
        plugin.start(makeSess({ userId: 'charlie', guildId: 'guild-1' })),
      ).rejects.toThrow(SessionLimitExceededError);

      // User charlie in guild-2: allowed (1/1 charlie, 1/2 guild-2)
      await expect(
        plugin.start(makeSess({ userId: 'charlie', guildId: 'guild-2' })),
      ).resolves.toBe(true);
    });
  });

  describe('action: custom', () => {
    test('GIVEN custom action with proceed=true THEN allows session through', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: Scope.User,
            onExceed: AE.custom(() => ({
              proceed: true,
              displace: null,
            })),
          },
        ],
      });

      await plugin.start(makeSess({ userId: 'u' }));
      await expect(plugin.start(makeSess({ userId: 'u' }))).resolves.toBe(true);
    });
  });

  describe('predicates', () => {
    test('GIVEN predicate checking user tier THEN applies corresponding max rule', async () => {
      const plugin = DjsSessionPlugin.create();
      plugin.getSessionLimits().register({
        session: MockSession,
        predicate: (_, meta) => Tier.get(meta) === 'premium',
        rules: [{ max: 5, scope: Scope.User, onExceed: AE.Error }],
      });
      plugin.getSessionLimits().register({
        session: MockSession,
        predicate: (_, meta) => Tier.get(meta) !== 'premium',
        rules: [{ max: 1, scope: Scope.User, onExceed: AE.Error }],
      });

      const premiumMeta = (): Metadata => {
        const m = Object.create(null) as Metadata;
        Tier.set(m, 'premium');
        return m;
      };

      await plugin.start(makeSess({ userId: 'u' }), premiumMeta());
      await plugin.start(makeSess({ userId: 'u' }), premiumMeta());

      await expect(plugin.start(makeSess({ userId: 'u' }))).rejects.toThrow(
        SessionLimitExceededError,
      );
    });
  });
});


