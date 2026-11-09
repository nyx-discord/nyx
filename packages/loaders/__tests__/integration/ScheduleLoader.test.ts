import { StubBot } from '#mocks/StubBot';
import { resolve } from 'path';
import { describe, expect, test, vi } from 'vitest';
import { ScheduleLoader } from '../../src/loaders/schedule/ScheduleLoader';

const fixturesDir = resolve(__dirname, '..', 'fixtures', 'schedules');
const bot = StubBot.create();

describe('ScheduleLoader', () => {
  test('GIVEN two schedule files in recursive dirs THEN both are instantiated and returned', async () => {
    const schedules = await ScheduleLoader.load({
      bot,
      register: false,
      path: fixturesDir,
    });

    expect(schedules).toHaveLength(2);
    const intervals = schedules.map((s) => s.getInterval()).sort();
    expect(intervals).toEqual(['0 0 * * *', '0 0 * * 0']);
  });

  test('GIVEN instantiated schedules THEN getId and getInterval return defined values', async () => {
    const schedules = await ScheduleLoader.load({
      bot,
      register: false,
      path: fixturesDir,
    });

    for (const schedule of schedules) {
      expect(schedule.getId()).toBeDefined();
      expect(schedule.getInterval()).toBeDefined();
    }
  });

  describe('registration', () => {
    test('GIVEN register is true WHEN loaded THEN schedules are added to the bot schedule manager', async () => {
      const scheduleManager = bot.getScheduleManager();
      vi.spyOn(scheduleManager, 'addSchedule').mockResolvedValue(scheduleManager as any);

      const schedules = await ScheduleLoader.load({
        bot,
        register: true,
        path: fixturesDir,
      });

      expect(scheduleManager.addSchedule).toHaveBeenCalledTimes(schedules.length);
      for (const schedule of schedules) {
        expect(scheduleManager.addSchedule).toHaveBeenCalledWith(schedule);
      }
    });

    test('GIVEN register is false WHEN loaded THEN schedules are not added to the bot schedule manager', async () => {
      const scheduleManager = bot.getScheduleManager();
      vi.spyOn(scheduleManager, 'addSchedule').mockResolvedValue(scheduleManager as any);

      await ScheduleLoader.load({
        bot,
        register: false,
        path: fixturesDir,
      });

      expect(scheduleManager.addSchedule).not.toHaveBeenCalled();
    });
  });
});
