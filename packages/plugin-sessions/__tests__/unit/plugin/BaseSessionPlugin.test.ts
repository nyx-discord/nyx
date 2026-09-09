import {
  AssertionError,
  BotStatusEnum,
  ObjectNotFoundError,
  type AnyEventSubscriber,
  type NyxBot,
} from '@nyx-discord/types';
import {
  BasicEventBus,
  DefaultMetadataFactory,
} from '@nyx-discord/base';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  BaseSessionPlugin,
  DefaultSessionCustomIdCodec,
  DefaultSessionLimitManager,
  DefaultSessionPromiseRepository,
  DefaultSessionRepository,
  SessionEndCodes,
  SessionExceedAction,
  SessionLimitExceededError,
  SessionLimitScope,
  SessionStateEnum,
  SessionEventEnum,
  type SessionEventArgs,
  type SessionExecutor,
  type SessionInteractionMeta,
} from '#src';
import { MockSession } from '../../mocks/MockSession';
import { getTestBot } from '../../testBot';

class TestSessionPlugin extends BaseSessionPlugin<any> {
  protected override getCustomId(interaction: any): string {
    return interaction?.customId ?? interaction?.data?.custom_id ?? '';
  }

  protected override getInteractionMeta(
    interaction: any,
  ): SessionInteractionMeta {
    return {
      id: interaction?.id ?? 'mock-interaction-id',
      type: interaction?.type ?? 3,
    };
  }

  public async triggerExpire(session: any): Promise<void> {
    return this.expire(session);
  }
}

function createMockSubscriber(id: symbol = Symbol('MockSubscriber')): AnyEventSubscriber {
  return {
    getId: vi.fn().mockReturnValue(id),
    getEvent: vi.fn().mockReturnValue('interactionCreate'),
    handleEvent: vi.fn().mockResolvedValue(undefined),
    protect: vi.fn(),
    unprotect: vi.fn(),
  } as unknown as AnyEventSubscriber;
}

function createTestPlugin(overrides: {
  executor?: Partial<SessionExecutor<any>>;
  subscriber?: AnyEventSubscriber;
} = {}) {
  const metaFactory = new DefaultMetadataFactory();
  const repository = DefaultSessionRepository.create<any>();
  const promiseRepository = DefaultSessionPromiseRepository.create<any>();
  const customIdCodec = DefaultSessionCustomIdCodec.create();
  const bus = BasicEventBus.createAsync<SessionEventArgs<any>>(metaFactory);
  vi.spyOn(bus, 'emit');
  const subscriber = overrides.subscriber ?? createMockSubscriber();

  const executor: SessionExecutor<any> = {
    start: vi.fn().mockResolvedValue(true),
    update: vi.fn().mockResolvedValue(true),
    end: vi.fn().mockResolvedValue({ completed: true }),
    handleMissing: vi.fn().mockResolvedValue(undefined),
    setMissingHandler: vi.fn(),
    getMissingHandler: vi.fn(),
    getStartMiddleware: vi.fn(),
    getUpdateMiddleware: vi.fn(),
    getStartErrorHandler: vi.fn(),
    getUpdateErrorHandler: vi.fn(),
    getEndErrorHandler: vi.fn(),
    ...overrides.executor,
  } as unknown as SessionExecutor<any>;

  const plugin = new TestSessionPlugin({
    customIdCodec,
    executor,
    repository,
    promiseRepository,
    subscriber,
    bus,
    metaFactory,
  });

  return {
    plugin,
    repository,
    promiseRepository,
    customIdCodec,
    bus,
    executor,
    subscriber,
  };
}

describe('BaseSessionPlugin (Lifecycle & Behavior)', () => {
  let bot: NyxBot;

  beforeEach(async () => {
    bot = await getTestBot();
  });

  describe('Session Lifecycle (Start -> Update -> End)', () => {
    test('GIVEN an uninitialized session WHEN started THEN enters Running state, is retrievable via resolve(), emits SessionStart, and repository contains it', async () => {
      const { plugin, repository, customIdCodec, bus } = createTestPlugin();
      const session = await MockSession.createMock();
      const customId = customIdCodec.serialize({ id: session.getId(), page: null, extra: null });

      const started = await plugin.start(session);

      expect(started).toBe(true);
      expect(session.getState()).toBe(SessionStateEnum.Running);
      expect(repository.has(session.getId())).toBe(true);

      const resolved = await plugin.resolve({ customId } as any);
      expect(resolved).toBe(session);

      // Verify event emission
      expect(bus.emit).toHaveBeenCalledWith(
        SessionEventEnum.SessionStart,
        expect.arrayContaining([session, session.getStartInteraction()]),
      );
    });

    test('GIVEN a running session WHEN update interaction is received THEN executes update on session, emits SessionUpdate, and remains active', async () => {
      const { plugin, customIdCodec, executor, bus } = createTestPlugin();
      const session = await MockSession.createMock();
      await plugin.start(session);

      const customId = customIdCodec.serialize({ id: session.getId(), page: null, extra: 'step-2' });
      const interaction = { customId, id: 'interaction-1', type: 3 };

      const updated = await plugin.update(interaction as any);

      expect(updated).toBe(true);
      expect(executor.update).toHaveBeenCalledWith(
        session,
        interaction,
        expect.anything(),
      );
      expect(session.getState()).toBe(SessionStateEnum.Running);

      // Verify event emission
      expect(bus.emit).toHaveBeenCalledWith(
        SessionEventEnum.SessionUpdate,
        expect.arrayContaining([session, interaction]),
      );
    });

    test('GIVEN a running session WHEN end() is called THEN transitions to Ended, is removed from repository, emits SessionEnd, and promise resolves with end data', async () => {
      const { plugin, repository, customIdCodec, promiseRepository, executor, bus } =
        createTestPlugin();
      const session = await MockSession.createMock();
      const customId = customIdCodec.serialize({ id: session.getId(), page: null, extra: null });
      await plugin.start(session);

      const sessionPromise = promiseRepository.getPromise(session);
      const expectedEndResult = { reason: 'finished successfully', code: SessionEndCodes.SelfEnded, result: { score: 100 } };
      vi.mocked(executor.end).mockResolvedValue(expectedEndResult);

      await plugin.end(session, 'finished successfully', SessionEndCodes.SelfEnded);

      expect(session.getState()).toBe(SessionStateEnum.Ended);
      expect(repository.has(session.getId())).toBe(false);

      const resolved = await plugin.resolve({ customId } as any);
      expect(resolved).toBeNull();

      await expect(sessionPromise).resolves.toEqual(expectedEndResult);

      // Verify event emission
      expect(bus.emit).toHaveBeenCalledWith(
        SessionEventEnum.SessionEnd,
        expect.arrayContaining([session, expectedEndResult]),
      );
    });

    test('GIVEN an active session WHEN expire() is triggered THEN transitions to Ended, emits SessionExpire, removes session, and resolves session promise', async () => {
      const { plugin, repository, promiseRepository, executor, bus } = createTestPlugin();
      const session = await MockSession.createMock();
      await plugin.start(session);

      const sessionPromise = promiseRepository.getPromise(session);
      const expireData = { reason: String(SessionEndCodes.Expired), code: SessionEndCodes.Expired, result: { expired: true } };
      vi.mocked(executor.end).mockResolvedValue(expireData);

      await plugin.triggerExpire(session);

      expect(session.getState()).toBe(SessionStateEnum.Ended);

      await expect(sessionPromise).resolves.toEqual(expireData);

      // Verify event emission
      expect(bus.emit).toHaveBeenCalledWith(
        SessionEventEnum.SessionExpire,
        expect.arrayContaining([session, expireData]),
      );
    });
  });

  describe('Session Limits & Slot Management', () => {
    test('GIVEN a max 1 session user limit WHEN a second session starts for the same user THEN rejects start and leaves second session unsaved', async () => {
      const { plugin, repository } = createTestPlugin();

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

      const session1 = MockSession.withInteraction(bot, { userId: 'user-limit-1' });
      const session2 = MockSession.withInteraction(bot, { userId: 'user-limit-1' });

      await plugin.start(session1);
      expect(repository.has(session1.getId())).toBe(true);

      await expect(plugin.start(session2)).rejects.toThrow(
        SessionLimitExceededError,
      );
      expect(repository.has(session2.getId())).toBe(false);
      expect(session2.getState()).toBe(SessionStateEnum.Uninitalized);
    });

    test('GIVEN a session limit WHEN an active session ends THEN frees the slot allowing a new session to start', async () => {
      const { plugin, repository } = createTestPlugin();

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

      const session1 = MockSession.withInteraction(bot, { userId: 'user-slot-1' });
      const session2 = MockSession.withInteraction(bot, { userId: 'user-slot-1' });

      await plugin.start(session1);
      await plugin.end(session1, 'done', SessionEndCodes.SelfEnded);

      const startedSecond = await plugin.start(session2);
      expect(startedSecond).toBe(true);
      expect(repository.has(session2.getId())).toBe(true);
    });
  });

  describe('Fault Tolerance & Rollbacks', () => {
    test('GIVEN executor.start fails (returns false) THEN deletes session from repository to prevent ghost sessions', async () => {
      const { plugin, repository, executor } = createTestPlugin();
      vi.mocked(executor.start).mockResolvedValue(false);

      const session = await MockSession.createMock();
      const started = await plugin.start(session);

      expect(started).toBe(false);
      expect(repository.has(session.getId())).toBe(false);
    });

    test('GIVEN repository.save throws an unexpected error THEN catches error, logs it, and returns session.hasReplied()', async () => {
      const { plugin, repository } = createTestPlugin();
      const mockLogger = { error: vi.fn() };
      const mockBot = {
        getStatus: vi.fn().mockReturnValue(BotStatusEnum.Running),
        subscribeToClient: vi.fn().mockResolvedValue(undefined),
        getLogger: vi.fn().mockReturnValue(mockLogger),
      } as unknown as NyxBot;
      await plugin.onRegister(mockBot);

      vi.spyOn(repository, 'save').mockRejectedValue(new Error('Persistence failure'));
      const session = await MockSession.createMock();
      vi.spyOn(session, 'hasReplied').mockReturnValue(false);

      const result = await plugin.start(session);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('Missing & Unknown Session Handling', () => {
    test('GIVEN an interaction with customId for an unknown/expired session THEN invokes executor.handleMissing and returns true', async () => {
      const { plugin, customIdCodec, executor } = createTestPlugin();
      const customId = customIdCodec.serialize({ id: 'non-existent-session-id', page: null, extra: null });
      const interaction = { customId, id: 'interaction-999', type: 3 };

      const handled = await plugin.update(interaction as any);

      expect(handled).toBe(true);
      expect(executor.handleMissing).toHaveBeenCalledWith(
        'non-existent-session-id',
        interaction,
      );
    });

    test('GIVEN an invalid customId string that cannot be decoded THEN returns false without querying repository', async () => {
      const { plugin, repository, executor } = createTestPlugin();
      const interaction = { customId: 'invalid-non-session-custom-id', id: 'interaction-1', type: 3 };

      const handled = await plugin.update(interaction as any);

      expect(handled).toBe(false);
      expect(executor.update).not.toHaveBeenCalled();
      expect(executor.handleMissing).not.toHaveBeenCalled();
    });

    test('GIVEN session transitions to Ended during update THEN stops processing and does not refresh TTL', async () => {
      const { plugin, customIdCodec, executor, repository } = createTestPlugin();
      const session = await MockSession.createMock();
      await plugin.start(session);

      vi.spyOn(repository, 'setTTL');
      vi.mocked(executor.update).mockImplementation(async (s: any) => {
        s.setState(SessionStateEnum.Ended);
        return true;
      });

      const customId = customIdCodec.serialize({ id: session.getId(), page: null, extra: null });
      const updated = await plugin.update({ customId, id: 'int-1', type: 3 } as any);

      expect(updated).toBe(true);
      expect(repository.setTTL).not.toHaveBeenCalled();
    });
  });

  describe('State Machine Contract Guards', () => {
    test('GIVEN a session already in Running state WHEN start() is called THEN throws AssertionError', async () => {
      const { plugin } = createTestPlugin();
      const session = await MockSession.createMock();
      await plugin.start(session);

      await expect(plugin.start(session)).rejects.toThrow(AssertionError);
    });

    test('GIVEN a session already in Ended state WHEN start() is called THEN throws AssertionError', async () => {
      const { plugin } = createTestPlugin();
      const session = await MockSession.createMock();
      await plugin.start(session);
      await plugin.end(session, 'done', SessionEndCodes.SelfEnded);

      await expect(plugin.start(session)).rejects.toThrow(AssertionError);
    });

    test('GIVEN a session not in repository WHEN end() is called THEN throws ObjectNotFoundError', async () => {
      const { plugin } = createTestPlugin();
      const session = await MockSession.createMock();
      // Set to running without adding to repo
      session.setState(SessionStateEnum.Running);

      await expect(
        plugin.end(session, 'cancelled', SessionEndCodes.SelfEnded),
      ).rejects.toThrow(ObjectNotFoundError);
    });

    test('GIVEN a session in Uninitalized state WHEN end() is called THEN throws AssertionError', async () => {
      const { plugin } = createTestPlugin();
      const session = await MockSession.createMock();

      await expect(
        plugin.end(session, 'cancelled', SessionEndCodes.SelfEnded),
      ).rejects.toThrow(AssertionError);
    });

    test('GIVEN a session in Ended state WHEN end() is called THEN throws AssertionError', async () => {
      const { plugin } = createTestPlugin();
      const session = await MockSession.createMock();
      await plugin.start(session);
      await plugin.end(session, 'done', SessionEndCodes.SelfEnded);

      await expect(
        plugin.end(session, 'done again', SessionEndCodes.SelfEnded),
      ).rejects.toThrow(AssertionError);
    });
  });

  describe('Subscriber & Bot Registration Lifecycle', () => {
    test('GIVEN plugin registered on bot THEN registers subscriber to client event bus and starts repository', async () => {
      const { plugin, repository, subscriber } = createTestPlugin();
      const mockBot = {
        getStatus: vi.fn().mockReturnValue(BotStatusEnum.Running),
        subscribeToClient: vi.fn().mockResolvedValue(undefined),
      } as unknown as NyxBot;

      await plugin.onRegister(mockBot);

      expect(mockBot.subscribeToClient).toHaveBeenCalledWith(subscriber);
      expect(plugin.isRunning()).toBe(true);
    });

    test('GIVEN setUpdateSubscriber called after registration THEN swaps subscriber registration on client event bus', async () => {
      const { plugin, subscriber: oldSubscriber } = createTestPlugin();
      const clientBus = {
        subscribe: vi.fn().mockResolvedValue(undefined),
        unsubscribe: vi.fn().mockResolvedValue(undefined),
      };
      const mockBot = {
        getStatus: vi.fn().mockReturnValue(BotStatusEnum.Running),
        subscribeToClient: vi.fn().mockResolvedValue(undefined),
        getClientEventBus: vi.fn().mockReturnValue(clientBus),
      } as unknown as NyxBot;
      await plugin.onRegister(mockBot);

      const newSubscriber = createMockSubscriber(Symbol('NewSubscriber'));
      await plugin.setUpdateSubscriber(newSubscriber);

      expect(clientBus.unsubscribe).toHaveBeenCalledWith(oldSubscriber);
      expect(clientBus.subscribe).toHaveBeenCalledWith(newSubscriber);
      expect(plugin.getUpdateSubscriber()).toBe(newSubscriber);
    });

    test('GIVEN setUpdateSubscriber called before registration THEN throws AssertionError', async () => {
      const { plugin } = createTestPlugin();
      const newSubscriber = createMockSubscriber(Symbol('NewSubscriber'));

      await expect(
        plugin.setUpdateSubscriber(newSubscriber),
      ).rejects.toThrow(AssertionError);
    });

    test('GIVEN BaseSessionPlugin.getFromBot called THEN retrieves plugin from bot plugin manager', () => {
      const { plugin } = createTestPlugin();
      const mockBot = {
        getPluginManager: vi.fn().mockReturnValue({
          getPluginByClass: vi.fn().mockReturnValue(plugin),
        }),
      } as unknown as NyxBot;

      const found = BaseSessionPlugin.getFromBot(mockBot);
      expect(found).toBe(plugin);
    });
  });
});
