import { EventEmitter } from 'events';
import { describe, expect, expectTypeOf, test, vi } from 'vitest';
import type { ApplicationCommand, Client, ClientEvents } from 'discord.js';
import type {
  BotService,
  CommandManager,
  EventBus,
  NyxBot,
  PluginManager,
  ScheduleManager,
} from '@nyx-discord/types';
import {
  DefaultBotService,
  DefaultPluginManager,
  DefaultScheduleManager,
} from '@nyx-discord/base';
import {
  DjsBot,
  DjsNyxClient,
  DefaultCommandManager,
  type DjsInteractionTypes,
} from '../../src';

function createMockClient() {
  const emitter = new EventEmitter();
  const cmdMgr = {
    set: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(undefined),
    edit: vi.fn().mockResolvedValue(undefined),
  };
  return Object.assign(emitter, {
    application: { commands: cmdMgr },
    user: { id: '123' },
    login: vi.fn().mockResolvedValue('token'),
    destroy: vi.fn().mockResolvedValue(undefined),
  }) as unknown as Client;
}

describe('DjsBot', () => {
  describe('create', () => {
    test('GIVEN default options generator WHEN create is called THEN instantiates bot with default dependencies', () => {
      const client = createMockClient();
      const bot = DjsBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: false,
      }));

      expect(bot).toBeInstanceOf(DjsBot);
      expect(bot.getClient()).toBeInstanceOf(DjsNyxClient);
      expect(bot.getCommandManager()).toBeInstanceOf(DefaultCommandManager);
      expect(bot.getScheduleManager()).toBeInstanceOf(DefaultScheduleManager);
      expect(bot.getService()).toBeInstanceOf(DefaultBotService);
      expect(bot.getPluginManager()).toBeInstanceOf(DefaultPluginManager);
      expect(bot.getClientEventBus()).toBeDefined();
      expect(bot.getLogger()).toBe(console);
      expect(bot.getToken()).toBe('test-token');

      expectTypeOf(bot).toExtend<NyxBot<any>>();
      expectTypeOf(bot.getClient()).toExtend<DjsNyxClient>();
      expectTypeOf(bot.getCommandManager()).toEqualTypeOf<
        CommandManager<DjsInteractionTypes, ClientEvents, ApplicationCommand>
      >();
      expectTypeOf(bot.getScheduleManager()).toEqualTypeOf<ScheduleManager>();
      expectTypeOf(bot.getService()).toEqualTypeOf<BotService>();
      expectTypeOf(bot.getPluginManager()).toEqualTypeOf<PluginManager>();
      expectTypeOf(bot.getClientEventBus()).toEqualTypeOf<EventBus<ClientEvents>>();
    });

    test('GIVEN custom injected dependencies WHEN create is called THEN bot uses the injected instances', () => {
      const client = createMockClient();
      interface CustomCommandManager extends CommandManager<DjsInteractionTypes, ClientEvents, ApplicationCommand> {
        customCommandMethod(): void;
      }
      interface CustomScheduleManager extends ScheduleManager {
        customScheduleMethod(): void;
      }
      interface CustomService extends BotService {
        customServiceMethod(): void;
      }
      interface CustomPluginManager extends PluginManager {
        customPluginMethod(): void;
      }
      interface CustomClientEventBus extends EventBus<ClientEvents> {
        customBusMethod(): void;
      }

      const customCommandManager = {
        deploy: vi.fn(),
        getCommands: vi.fn(),
        addCommands: vi.fn(),
        removeCommands: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        customCommandMethod: vi.fn(),
      } as unknown as CustomCommandManager;
      const customScheduleManager = {
        getSchedules: vi.fn(),
        addSchedule: vi.fn(),
        removeSchedule: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        customScheduleMethod: vi.fn(),
      } as unknown as CustomScheduleManager;
      const customService = {
        start: vi.fn(),
        stop: vi.fn(),
        getStatus: vi.fn(),
        isRunning: vi.fn(),
        getEventBus: vi.fn(),
        customServiceMethod: vi.fn(),
      } as unknown as CustomService;
      const customPluginManager = {
        getPlugins: vi.fn(),
        register: vi.fn(),
        unregister: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        customPluginMethod: vi.fn(),
      } as unknown as CustomPluginManager;
      const customClientEventBus = {
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
        emit: vi.fn(),
        customBusMethod: vi.fn(),
      } as unknown as CustomClientEventBus;

      const bot = DjsBot.create((_bot) => ({
        client,
        token: 'custom-token',
        logger: console,
        deployCommands: false,
        commandManager: customCommandManager,
        scheduleManager: customScheduleManager,
        service: customService,
        pluginManager: customPluginManager,
        clientEventBus: customClientEventBus,
      }));

      expect(bot.getCommandManager()).toBe(customCommandManager);
      expect(bot.getScheduleManager()).toBe(customScheduleManager);
      expect(bot.getService()).toBe(customService);
      expect(bot.getPluginManager()).toBe(customPluginManager);
      expect(bot.getClientEventBus()).toBe(customClientEventBus);

      expectTypeOf(bot.getCommandManager()).toExtend<CustomCommandManager>();
      expectTypeOf(bot.getScheduleManager()).toExtend<CustomScheduleManager>();
      expectTypeOf(bot.getService()).toExtend<CustomService>();
      expectTypeOf(bot.getPluginManager()).toExtend<CustomPluginManager>();
      expectTypeOf(bot.getClientEventBus()).toExtend<CustomClientEventBus>();
    });
  });

  describe('lifecycle', () => {
    test('GIVEN deployCommands is true WHEN bot.start() is called THEN starts service and deploys commands', async () => {
      const client = createMockClient();
      const bot = DjsBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: true,
      }));

      const service = bot.getService();
      const commandManager = bot.getCommandManager();
      vi.spyOn(service, 'start').mockResolvedValue(service);
      vi.spyOn(commandManager, 'deploy').mockResolvedValue(undefined);

      await bot.start();

      expect(service.start).toHaveBeenCalledOnce();
      expect(commandManager.deploy).toHaveBeenCalledOnce();
    });

    test('GIVEN deployCommands is false WHEN bot.start() is called THEN starts service but does not deploy commands', async () => {
      const client = createMockClient();
      const bot = DjsBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: false,
      }));

      const service = bot.getService();
      const commandManager = bot.getCommandManager();
      vi.spyOn(service, 'start').mockResolvedValue(service);
      vi.spyOn(commandManager, 'deploy').mockResolvedValue(undefined);

      await bot.start();

      expect(service.start).toHaveBeenCalledOnce();
      expect(commandManager.deploy).not.toHaveBeenCalled();
    });

    test('GIVEN service fails to start WHEN bot.start() is called THEN propagates error and skips deploy', async () => {
      const client = createMockClient();
      const bot = DjsBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: true,
      }));

      const service = bot.getService();
      const commandManager = bot.getCommandManager();
      const startError = new Error('Service startup failed');
      vi.spyOn(service, 'start').mockRejectedValue(startError);
      vi.spyOn(commandManager, 'deploy').mockResolvedValue(undefined);

      await expect(bot.start()).rejects.toThrow(startError);

      expect(service.start).toHaveBeenCalledOnce();
      expect(commandManager.deploy).not.toHaveBeenCalled();
    });

    test('GIVEN bot is running WHEN bot.stop() is called THEN stops service with provided reason', async () => {
      const client = createMockClient();
      const bot = DjsBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: false,
      }));

      const service = bot.getService();
      vi.spyOn(service, 'stop').mockResolvedValue(service);

      await bot.stop('manual-shutdown');

      expect(service.stop).toHaveBeenCalledWith('manual-shutdown');
    });
  });
});
