import { createStubBot } from '#mocks/stubBot';
import { resolve } from 'path';
import { describe, expect, test } from 'vitest';
import { ScheduleLoader } from '../../src/loaders/schedule/ScheduleLoader';

const fixturesDir = resolve(__dirname, '..', 'fixtures', 'schedules');
const bot = createStubBot();

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
});
