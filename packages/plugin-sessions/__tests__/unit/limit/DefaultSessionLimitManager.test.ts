import { MockSession } from '#mocks/MockSession';
import {
  SessionExceedAction,
  SessionLimitExceededError,
  SessionLimitScope,
  DjsSessionPlugin,
} from '#src';
import type {
  Metadata,
  NyxBot
} from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import {
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import { getTestBot } from '../../testBot';

const Tier = TypedFields.create<'premium' | 'free'>('Tier');

let bot: NyxBot;

const makeSession = (overrides?: {
  userId?: string;
  guildId?: string | null;
  channelId?: string;
}) => MockSession.withInteraction(bot, overrides);

function createPlugin(): DjsSessionPlugin {
  return DjsSessionPlugin.create();
}

beforeAll(async () => {
  bot = await getTestBot();
});

class SubSession extends MockSession {}

describe('DefaultSessionLimitManager', () => {
  describe('error action', () => {
    it('throws when limit exceeded', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      await plugin.start(makeSession({ userId: 'user-1' }));

      await expect(
        plugin.start(makeSession({ userId: 'user-1' })),
      ).rejects.toThrow(SessionLimitExceededError);
    });

    it('passes when under the limit', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 5,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      await expect(plugin.start(makeSession())).resolves.toBe(true);
    });

    it('separates by user scope', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      await expect(
        plugin.start(makeSession({ userId: 'alice' })),
      ).resolves.toBe(true);
      await expect(plugin.start(makeSession({ userId: 'bob' }))).resolves.toBe(
        true,
      );
    });

    it('checks both parent and child policies via prototype walk', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 2,
            scope: SessionLimitScope.Guild,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });
      plugin.getSessionLimits().register({
        session: SubSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      await expect(
        plugin.start(
          SubSession.withInteraction(bot, {
            userId: 'alice',
            guildId: 'guild-x',
            channelId: 'c1',
          }),
        ),
      ).resolves.toBe(true);
    });
  });

  describe('displace action', () => {
    it('passes sessions to the pick function', async () => {
      const plugin = createPlugin();
      const pickSpy = vi.fn().mockReturnValue(undefined as never);

      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.displace(pickSpy),
          },
        ],
      });

      const first = makeSession({ userId: 'u' });
      await plugin.start(first);

      await plugin.start(makeSession({ userId: 'u' }));

      expect(pickSpy).toHaveBeenCalled();
      expect(pickSpy.mock.calls[0]![0]).toHaveLength(1);
    });
  });

  describe('custom handler', () => {
    it('blocks when handler returns proceed=false', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.custom(() => ({
              proceed: false,
            })),
          },
        ],
      });

      await plugin.start(makeSession({ userId: 'user-1' }));

      await expect(
        plugin.start(makeSession({ userId: 'user-1' })),
      ).rejects.toThrow(SessionLimitExceededError);
    });

    it('proceeds when proceed=true, displace=null', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.custom(() => ({
              proceed: true,
              displace: null,
            })),
          },
        ],
      });

      await plugin.start(makeSession({ userId: 'u' }));
      await expect(plugin.start(makeSession({ userId: 'u' }))).resolves.toBe(
        true,
      );
    });

    it('lets through and displaces when proceed=true with a displace target', async () => {
      const plugin = createPlugin();
      const first = makeSession({ userId: 'u' });
      const second = makeSession({ userId: 'u' });
      await plugin.start(first);
      await plugin.start(second);

      const third = makeSession({ userId: 'u' });
      let displacedTarget: unknown = null;
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.custom(() => {
              displacedTarget = first;
              return { proceed: true, displace: first };
            }),
          },
        ],
      });

      await plugin.start(third);

      expect(displacedTarget).toBe(first);
      expect(first.getState()).toBe('ended');
      expect(third.getState()).toBe('running');
    });
  });

  describe('composite scope', () => {
    it('blocks same user in same guild', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.composite(
              SessionLimitScope.User,
              SessionLimitScope.Guild,
            ),
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      await plugin.start(makeSession({ userId: 'alice', guildId: 'guild-a' }));

      await expect(
        plugin.start(makeSession({ userId: 'alice', guildId: 'guild-a' })),
      ).rejects.toThrow(SessionLimitExceededError);
    });
  });

  describe('predicates', () => {
    it('selects the matching policy by predicate', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        predicate: (_, meta) => Tier.get(meta) === 'premium',
        rules: [
          {
            max: 5,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });
      plugin.getSessionLimits().register({
        session: MockSession,
        predicate: (_, meta) => Tier.get(meta) !== 'premium',
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      const premiumMeta = (): Metadata => {
        const m = Object.create(null) as Metadata;
        Tier.set(m, 'premium');
        return m;
      };

      // premium user: up to 5 allowed
      for (let i = 0; i < 4; i++) {
        await plugin.start(makeSession({ userId: 'u' }), premiumMeta());
      }
      // 5th should pass
      await expect(
        plugin.start(makeSession({ userId: 'u' }), premiumMeta()),
      ).resolves.toBe(true);
    });

    it('throws AmbiguousSessionLimitError when multiple match', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 5,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      await expect(plugin.start(makeSession())).rejects.toThrow(
        'Multiple limit policies matched',
      );
    });

    it('passes when no predicate matches', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        predicate: (_, meta) => Tier.get(meta) === 'premium',
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      // No meta → no predicate match → no policy applies → passes.
      await expect(plugin.start(makeSession())).resolves.toBe(true);
    });
  });

  describe('remove', () => {
    it('removes all policies for a constructor', async () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 1,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      plugin.getSessionLimits().remove(MockSession);

      await expect(plugin.start(makeSession({ userId: 'u' }))).resolves.toBe(
        true,
      );
    });
  });

  describe('getPolicies', () => {
    it('returns the registered policies', () => {
      const plugin = createPlugin();
      plugin.getSessionLimits().register({
        session: MockSession,
        rules: [
          {
            max: 3,
            scope: SessionLimitScope.User,
            onExceed: SessionExceedAction.Error,
          },
        ],
      });

      const policies = plugin.getSessionLimits().getPolicies();
      expect(policies.has(MockSession)).toBe(true);
      expect(policies.get(MockSession)!).toHaveLength(1);
      expect(policies.get(MockSession)![0]!.rules[0]!.max).toBe(3);
    });
  });
});
