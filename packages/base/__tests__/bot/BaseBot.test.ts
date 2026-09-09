import { BotStatusEnum } from '@nyx-discord/types';
import { describe, expect, test, vi } from 'vitest';
import { MockBot } from './MockBot';

function createBot({
  deployCommands = false,
  serviceOverrides = {},
  commandManagerOverrides = {},
  clientEventBusOverrides = {},
}: {
  deployCommands?: boolean;
  serviceOverrides?: Record<string, any>;
  commandManagerOverrides?: Record<string, any>;
  clientEventBusOverrides?: Record<string, any>;
} = {}) {
  const mockClient = { login: vi.fn(), destroy: vi.fn() };
  const mockService = {
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    getStatus: vi.fn().mockReturnValue(BotStatusEnum.Waiting),
    ...serviceOverrides,
  };
  const mockCommandManager = {
    deploy: vi.fn().mockResolvedValue(undefined),
    ...commandManagerOverrides,
  };
  const mockScheduleManager = {};
  const mockPluginManager = {};
  const mockClientEventBus = {
    subscribe: vi.fn().mockResolvedValue(undefined),
    ...clientEventBusOverrides,
  };

  const bot = new MockBot(() => ({
    client: mockClient,
    token: 'token',
    logger: console,
    service: mockService,
    commandManager: mockCommandManager,
    scheduleManager: mockScheduleManager,
    pluginManager: mockPluginManager,
    clientEventBus: mockClientEventBus,
    deployCommands,
  } as any));

  return { bot, mockClient, mockService, mockCommandManager, mockClientEventBus };
}

describe('BaseBot', () => {
  test('GIVEN injected dependencies THEN getters return the exact instances', () => {
    const mockClient = { login: vi.fn(), destroy: vi.fn() } as any;
    const mockService = {} as any;
    const mockCommandManager = {} as any;
    const mockScheduleManager = {} as any;
    const mockPluginManager = {} as any;

    const bot = new MockBot(() => ({
      client: mockClient,
      token: 'token',
      id: 'id',
      logger: console,
      service: mockService,
      commandManager: mockCommandManager,
      scheduleManager: mockScheduleManager,
      pluginManager: mockPluginManager,
      deployCommands: false,
    } as any));

    expect(bot.getClient()).toBe(mockClient);
    expect(bot.getService()).toBe(mockService);
    expect(bot.getCommandManager()).toBe(mockCommandManager);
    expect(bot.getScheduleManager()).toBe(mockScheduleManager);
    expect(bot.getPluginManager()).toBe(mockPluginManager);
    expect(bot.getLogger()).toBe(console);
    expect(bot.getToken()).toBe('token');
  });

  describe('getClientEventBus', () => {
    test('GIVEN an injected client event bus THEN getClientEventBus returns that bus', () => {
      const { bot, mockClientEventBus } = createBot();
      expect(bot.getClientEventBus()).toBe(mockClientEventBus);
    });
  });

  describe('start', () => {
    test('GIVEN deployCommands false THEN calls service.start() and does NOT deploy commands', async () => {
      const { bot, mockService, mockCommandManager } = createBot({ deployCommands: false });

      await bot.start();

      expect(mockService.start).toHaveBeenCalledOnce();
      expect(mockCommandManager.deploy).not.toHaveBeenCalled();
    });

    test('GIVEN deployCommands true THEN calls service.start() AND deploys commands', async () => {
      const { bot, mockService, mockCommandManager } = createBot({ deployCommands: true });

      await bot.start();

      expect(mockService.start).toHaveBeenCalledOnce();
      expect(mockCommandManager.deploy).toHaveBeenCalledOnce();
    });

    test('GIVEN start called THEN returns this for chaining', async () => {
      const { bot } = createBot();
      const result = await bot.start();
      expect(result).toBe(bot);
    });

    test('GIVEN service.start() throws an error THEN commandManager.deploy is not called and the error is propagated', async () => {
      const error = new Error('service start failed');
      const { bot, mockService, mockCommandManager } = createBot({
        deployCommands: true,
        serviceOverrides: { start: vi.fn().mockRejectedValue(error) },
      });

      await expect(bot.start()).rejects.toThrow(error);
      expect(mockCommandManager.deploy).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    test('GIVEN no reason THEN calls service.stop() with undefined', async () => {
      const { bot, mockService } = createBot();

      await bot.stop();

      expect(mockService.stop).toHaveBeenCalledOnce();
      expect(mockService.stop).toHaveBeenCalledWith(undefined);
    });

    test('GIVEN a reason THEN forwards the reason to service.stop()', async () => {
      const { bot, mockService } = createBot();
      const reason = Symbol('shutdown');

      await bot.stop(reason);

      expect(mockService.stop).toHaveBeenCalledWith(reason);
    });

    test('GIVEN stop called THEN returns this for chaining', async () => {
      const { bot } = createBot();
      const result = await bot.stop();
      expect(result).toBe(bot);
    });
  });

  describe('getStatus', () => {
    test('GIVEN a service status THEN delegates to service.getStatus() and returns its value', () => {
      const { bot, mockService } = createBot({
        serviceOverrides: { getStatus: vi.fn().mockReturnValue(BotStatusEnum.Running) },
      });

      const status = bot.getStatus();

      expect(mockService.getStatus).toHaveBeenCalledOnce();
      expect(status).toBe(BotStatusEnum.Running);
    });
  });

  describe('decorate', () => {
    test('GIVEN a key and value THEN attaches them as a non-writable and non-configurable property', () => {
      const bot: MockBot = createBot().bot;

      bot.decorate('myKey', 42);

      expect((bot as any).myKey).toBe(42);

      const descriptor = Object.getOwnPropertyDescriptor(bot, 'myKey')!;
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
    });

    test('GIVEN a decorated property THEN reassigning throws TypeError in strict mode', () => {
      const bot: MockBot = createBot().bot;
      bot.decorate('frozenKey', 'original');

      expect(() => {
        (bot as any).frozenKey = 'changed';
      }).toThrow(TypeError);
    });

    test('GIVEN an already decorated key THEN re-decorating throws', () => {
      const bot: MockBot = createBot().bot;
      bot.decorate('uniqueKey', 1);

      expect(() => bot.decorate('uniqueKey', 2)).toThrow();
    });
  });

  describe('subscribeToClient', () => {
    test('GIVEN client subscribers THEN delegates to clientEventBus.subscribe()', async () => {
      const { bot, mockClientEventBus } = createBot();
      const subscriberA = { handleEvent: vi.fn(), getEvent: () => 'ready' } as any;
      const subscriberB = { handleEvent: vi.fn(), getEvent: () => 'messageCreate' } as any;

      await bot.subscribeToClient(subscriberA, subscriberB);

      expect(mockClientEventBus.subscribe).toHaveBeenCalledWith(subscriberA, subscriberB);
    });

    test('GIVEN subscribeToClient called THEN returns this for chaining', async () => {
      const { bot } = createBot();
      const subscriber = { handleEvent: vi.fn(), getEvent: () => 'ready' } as any;

      const result = await bot.subscribeToClient(subscriber);

      expect(result).toBe(bot);
    });
  });
});

