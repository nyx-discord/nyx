import {
  BotServiceEventEnum,
  BotStatusEnum,
  IllegalStateError,
} from '@nyx-discord/core';
import { describe, expect, test, vi } from 'vitest';
import { DefaultBotService } from '../../src';
import { StubEventBus } from '../event/mocks/StubEventBus';
import { StubServiceBot } from './mocks/StubServiceBot';

const createService = (
  bot = StubServiceBot.create(),
  bus = StubEventBus.create(Symbol('service-bus')),
) => new DefaultBotService({ bot: bot as never, bus: bus as never });

describe('DefaultBotService', () => {
  test('GIVEN create THEN returns an instance', () => {
    expect(
      DefaultBotService.create({ bot: StubServiceBot.create() as never }),
    ).toBeInstanceOf(DefaultBotService);
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
      const bus = StubEventBus.create(Symbol('service-bus'));
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
    test('GIVEN a service THEN throws not implemented', () => {
      const service = createService();

      expect(() => service.isRunning()).toThrow('Method not implemented');
    });
  });

  describe('start', () => {
    test('GIVEN a new service THEN starts managers, logs in, emits event', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create(Symbol('service-bus'));
      const service = createService(bot, bus);

      await service.start();

      expect(bot.getEventManager().onStart).toHaveBeenCalled();
      expect(bot.getScheduleManager().onStart).toHaveBeenCalled();
      expect(bot.getPluginManager().onStart).toHaveBeenCalled();
      expect(bot.getClient().login).toHaveBeenCalledWith('test-token');
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
      bot.getEventManager().onStart.mockRejectedValue(new Error('start fail'));
      const service = createService(bot);

      await expect(service.start()).rejects.toThrow('start fail');
      await expect(service.getStartPromise()).rejects.toThrow('start fail');
    });
  });

  describe('stop', () => {
    test('GIVEN a running service THEN stops managers, destroys client, emits event', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create(Symbol('service-bus'));
      const service = createService(bot, bus);
      await service.start();

      vi.mocked(bus.emit).mockClear();
      await service.stop();

      expect(bot.getCommandManager().onStop).toHaveBeenCalled();
      expect(bot.getScheduleManager().onStop).toHaveBeenCalled();
      expect(bot.getPluginManager().onStop).toHaveBeenCalled();
      expect(bot.getClient().destroy).toHaveBeenCalled();
      expect(bus.emit).toHaveBeenCalledWith(BotServiceEventEnum.Stop, []);
    });

    test('GIVEN stop with a reason THEN emits event with reason', async () => {
      const bot = StubServiceBot.create();
      const bus = StubEventBus.create(Symbol('service-bus'));
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
  });
});
