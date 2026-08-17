import { MockSession } from '#mocks/MockSession';
import {
  SessionExceedAction,
  SessionLimitExceededError,
  SessionLimitScope,
  DjsSessionPlugin,
} from '#src';
import type { Metadata, NyxBot } from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import { beforeAll, describe, expect, it } from 'vitest';
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
    it('allows different users independently', async () => {
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

    it('blocks the same user at max=1', async () => {
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
    it('allows different guilds independently', async () => {
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

    it('blocks the same guild at max=1', async () => {
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

    it("treats null guildId as 'dm' for DM sessions", async () => {
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
    it('blocks the same channel at max=1', async () => {
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

    it('allows different channels independently', async () => {
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
    it('blocks same user in same guild, allows otherwise', async () => {
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
    it('uses a custom key function', async () => {
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
    it('displaces the oldest session and starts the new one', async () => {
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
  });

  describe('action: custom', () => {
    it('proceed=true lets through', async () => {
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
    it('applies premium-tier max to matching users', async () => {
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
