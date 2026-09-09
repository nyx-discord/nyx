import type {
  BotService,
  BotServiceEventArgs,
  EventBus,
} from '@nyx-discord/types';
import {
  BotServiceEventEnum,
  BotStatusEnum,
  IllegalStateError,
} from '@nyx-discord/types';
import { describe, expect, expectTypeOf, test, vi } from 'vitest';
import { DefaultBotService } from '../../src';
import { StubEventBus } from '../event/mocks/StubEventBus';
import { StubServiceBot } from './mocks/StubServiceBot';

const createService = (
  bot = StubServiceBot.create(),
  bus = StubEventBus.create(),
) => new DefaultBotService({ bot: bot as never, bus: bus as never });

describe('DefaultBotService', () => {
  describe('create', () => {
    test('GIVEN default options WHEN create is called THEN instantiates with default bus', () => {
      const bot = StubServiceBot.create();
      const service = DefaultBotService.create({ bot: bot as never });

      expect(service).toBeInstanceOf(DefaultBotService);
      expect(service.getEventBus()).toBeDefined();

      expectTypeOf(service).toEqualTypeOf<BotService>();
      expectTypeOf(service.getEventBus()).toEqualTypeOf<EventBus<BotServiceEventArgs>>();
    });

    test('GIVEN injected custom bus WHEN create is called THEN uses the provided bus', () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create();
      const service = DefaultBotService.create({
        bot: bot as never,
        injections: { bus: bus as never },
      });

      expect(service.getEventBus()).toBe(bus);

      expectTypeOf(service).toEqualTypeOf<BotService>();
    });
  });

  describe('getStatus', () => {
    test('GIVEN a new service THEN status is Waiting', () => {
      const service = createService();
      expect(service.getStatus()).toBe(BotStatusEnum.Waiting);
    });

    test('GIVEN a started service THEN status is Running', async () => {
      const service = createService();
      await service.start();

      expect(service.getStatus()).toBe(BotStatusEnum.Running);
    });
  });

  describe('getEventBus', () => {
    test('GIVEN a service THEN returns the bus', () => {
      const bus = StubEventBus.create();
      const service = createService(StubServiceBot.create(), bus);

      expect(service.getEventBus()).toBe(bus);
    });
  });

  describe('getStartPromise', () => {
    test('GIVEN a new service THEN returns a pending promise', () => {
      const service = createService();

      const promise = service.getStartPromise();

      expect(promise).toBeInstanceOf(Promise);
    });

    test('GIVEN a started service THEN returns a resolved promise', async () => {
      const service = createService();
      await service.start();

      await expect(service.getStartPromise()).resolves.toBeDefined();
    });
  });

  describe('isRunning', () => {
    test('GIVEN a service THEN returns false before start', () => {
      const service = createService();

      expect(service.isRunning()).toBe(false);
    });
  });

  describe('start', () => {
    test('GIVEN a new service THEN starts managers, logs in, emits event', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create();
      const service = createService(bot, bus);

      await service.start();

      expect(bot.getScheduleManager().onStart).toHaveBeenCalled();
      expect(bot.getPluginManager().onStart).toHaveBeenCalled();
      expect(bot.getClient().login).toHaveBeenCalled();
      expect(bot.getCommandManager().onStart).toHaveBeenCalled();
      expect(bus.emit).toHaveBeenCalledWith(BotServiceEventEnum.Start, []);
    });

    test('GIVEN already started THEN throws IllegalStateError', async () => {
      const service = createService();
      await service.start();

      await expect(service.start()).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN start error THEN rejects start promise and rethrows', async () => {
      const bot = StubServiceBot.create();
      bot
        .getCommandManager()
        .onStart.mockRejectedValue(new Error('start fail'));
      const service = createService(bot);

      await expect(service.start()).rejects.toThrow('start fail');
      await expect(service.getStartPromise()).rejects.toThrow('start fail');
    });
    test('GIVEN login error THEN rejects start promise, rethrows, and reverts to Waiting status', async () => {
      const bot = StubServiceBot.create();
      bot.getClient().login.mockRejectedValue(new Error('login fail'));
      const service = createService(bot);

      await expect(service.start()).rejects.toThrow('login fail');
      await expect(service.getStartPromise()).rejects.toThrow('login fail');
      expect(service.getStatus()).toBe(BotStatusEnum.Waiting);
    });
  });

  describe('stop', () => {
    test('GIVEN a running service WHEN stop is called THEN stops managers, destroys client, emits event, and updates status', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create();
      const service = createService(bot, bus);
      await service.start();

      vi.mocked(bus.emit).mockClear();
      await service.stop();

      expect(bot.getCommandManager().onStop).toHaveBeenCalled();
      expect(bot.getScheduleManager().onStop).toHaveBeenCalled();
      expect(bot.getPluginManager().onStop).toHaveBeenCalled();
      expect(bot.getClient().destroy).toHaveBeenCalled();
      expect(bus.emit).toHaveBeenCalledWith(BotServiceEventEnum.Stop, []);
      
      expect(service.getStatus()).toBe(BotStatusEnum.Waiting);
      expect(service.isRunning()).toBe(false);
    });

    test('GIVEN stop with a reason THEN emits event with reason', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create();
      const service = createService(bot, bus);
      await service.start();

      vi.mocked(bus.emit).mockClear();
      const reason = Symbol('stop-reason');
      await service.stop(reason);

      expect(bus.emit).toHaveBeenCalledWith(BotServiceEventEnum.Stop, [reason]);
    });

    test('GIVEN not running THEN throws IllegalStateError', async () => {
      const service = createService();

      await expect(service.stop()).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN one manager throws during stop THEN still updates status and calls client.destroy', async () => {
      const bot = StubServiceBot.create();
      bot.getCommandManager().onStop.mockRejectedValue(new Error('stop error'));
      const service = createService(bot);
      await service.start();

      await expect(service.stop()).rejects.toThrow('stop error');
      
      expect(bot.getClient().destroy).toHaveBeenCalled();
      expect(service.getStatus()).toBe(BotStatusEnum.Waiting);
      expect(service.isRunning()).toBe(false);
    });
  });

  describe('setEventBus', () => {
    test('GIVEN a new bus THEN transfers subscribers and metadata', async () => {
      const bot = StubServiceBot.create();
      const oldBus = StubEventBus.create();
      const subscriber = { handleEvent: vi.fn(), getEvent: () => 'event' } as any;
      oldBus.subscribe(subscriber);
      oldBus.getSubscribers = vi.fn().mockReturnValue(new Map([['test', subscriber]]));

      const service = createService(bot, oldBus);
      
      const newBus = StubEventBus.create();
      await service.setEventBus(newBus as any);

      expect(service.getEventBus()).toBe(newBus);
      expect(newBus.subscribe).toHaveBeenCalledWith(subscriber);
      // It iterates through the old fields, which is empty here, but we can verify it doesn't throw.
    });
  });

  describe('subscribe', () => {
    test('GIVEN subscribers THEN delegates to bus', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create();
      const service = createService(bot, bus);

      const subscriber = { handleEvent: vi.fn(), getEvent: () => 'event' } as any;
      await service.subscribe(subscriber);

      expect(bus.subscribe).toHaveBeenCalledWith(subscriber);
    });
  });
});
