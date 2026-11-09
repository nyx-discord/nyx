import { StubBot } from '#mocks/StubBot';
import { resolve } from 'path';
import { describe, expect, test, vi } from 'vitest';
import { LoaderError } from '../../src/error/LoaderError';
import { EventLoader } from '../../src/loaders/event/EventLoader';

const fixturesDir = resolve(__dirname, '..', 'fixtures', 'events');
const bot = StubBot.create();

describe('EventLoader', () => {
  test('GIVEN one file per subscriber type THEN all 6 buckets are populated correctly', async () => {
    const buckets = await EventLoader.load({
      bot,
      register: false,
      path: resolve(fixturesDir, 'all-types'),
    });

    expect(buckets.client).toHaveLength(1);
    expect(buckets.client[0]?.getEvent()).toBe('ready');

    expect(buckets.command).toHaveLength(1);
    expect(buckets.command[0]?.getEvent()).toBe('commandAdd');

    expect(buckets.service).toHaveLength(1);
    expect(buckets.service[0]?.getEvent()).toBe('start');

    expect(buckets.plugin).toHaveLength(1);
    expect(buckets.plugin[0]?.getEvent()).toBe('pluginAdd');

    expect(buckets.bus).toHaveLength(1);
    expect(buckets.bus[0]?.getEvent()).toBe('eventSubscriberAdd');

    expect(buckets.schedule).toHaveLength(1);
    expect(buckets.schedule[0]?.getEvent()).toBe('scheduleAdd');
  });

  describe('registration', () => {
    test('GIVEN register is true WHEN loaded THEN subscribers are added to their respective managers', async () => {
      vi.spyOn(bot, 'subscribeToClient').mockResolvedValue(bot);
      
      const commandManager = bot.getCommandManager();
      vi.spyOn(commandManager, 'subscribe').mockResolvedValue(commandManager as any);
      
      const service = bot.getService();
      vi.spyOn(service, 'subscribe').mockResolvedValue(service as any);
      
      const pluginManager = bot.getPluginManager();
      vi.spyOn(pluginManager, 'subscribe').mockResolvedValue(pluginManager as any);
      
      const scheduleManager = bot.getScheduleManager();
      vi.spyOn(scheduleManager, 'subscribe').mockResolvedValue(scheduleManager as any);

      const buckets = await EventLoader.load({
        bot,
        register: true,
        path: resolve(fixturesDir, 'all-types'),
      });

      expect(bot.subscribeToClient).toHaveBeenCalledWith(...buckets.client);
      expect(commandManager.subscribe).toHaveBeenCalledWith(...buckets.command);
      expect(service.subscribe).toHaveBeenCalledWith(...buckets.service);
      expect(pluginManager.subscribe).toHaveBeenCalledWith(...buckets.plugin);
      expect(scheduleManager.subscribe).toHaveBeenCalledWith(...buckets.schedule);
    });

    test('GIVEN register is false WHEN loaded THEN subscribers are not registered', async () => {
      vi.spyOn(bot, 'subscribeToClient').mockResolvedValue(bot);
      
      const commandManager = bot.getCommandManager();
      vi.spyOn(commandManager, 'subscribe').mockResolvedValue(commandManager as any);
      
      const service = bot.getService();
      vi.spyOn(service, 'subscribe').mockResolvedValue(service as any);
      
      const pluginManager = bot.getPluginManager();
      vi.spyOn(pluginManager, 'subscribe').mockResolvedValue(pluginManager as any);
      
      const scheduleManager = bot.getScheduleManager();
      vi.spyOn(scheduleManager, 'subscribe').mockResolvedValue(scheduleManager as any);

      await EventLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'all-types'),
      });

      expect(bot.subscribeToClient).not.toHaveBeenCalled();
      expect(commandManager.subscribe).not.toHaveBeenCalled();
      expect(service.subscribe).not.toHaveBeenCalled();
      expect(pluginManager.subscribe).not.toHaveBeenCalled();
      expect(scheduleManager.subscribe).not.toHaveBeenCalled();
    });
  });

  test('GIVEN an export that extends no known subscriber base class THEN throws LoaderError', async () => {
    await expect(
      EventLoader.load({
        bot,
        register: false,
        path: resolve(fixturesDir, 'bad-unclassified'),
      }),
    ).rejects.toThrow(LoaderError);
  });
});
