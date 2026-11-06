import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { ScheduleInterval } from '../../../src';
import {
  DefaultScheduleExecutionScheduler,
  DefaultScheduleManager,
} from '../../../src';
import { StubBot } from '../../plugin/mocks/StubBot';
import { MockSchedule } from '../mocks/MockSchedule';
import { StubScheduleExecutor } from '../mocks/StubScheduleExecutor';
import { StubScheduleMetadata } from '../mocks/StubScheduleMetadata';

describe('Schedule interval forms', () => {
  // start on a whole minute so cron tick counts are predictable
  const START = new Date(Math.ceil(Date.now() / 60_000) * 60_000);

  let executor: ReturnType<typeof StubScheduleExecutor.create>;
  let scheduler: DefaultScheduleExecutionScheduler;
  const started: MockSchedule[] = [];

  const run = async (interval: ScheduleInterval): Promise<MockSchedule> => {
    const schedule = new MockSchedule(interval);
    await scheduler.start(schedule);
    started.push(schedule);
    return schedule;
  };

  const ticks = () => vi.mocked(executor.tick).mock.calls.length;

  beforeEach(() => {
    vi.useFakeTimers({ now: START });
    executor = StubScheduleExecutor.create();
    scheduler = DefaultScheduleExecutionScheduler.create(
      executor,
      StubScheduleMetadata.create(),
    ) as DefaultScheduleExecutionScheduler;
  });

  afterEach(async () => {
    for (const schedule of started.splice(0)) {
      if (scheduler.getJobForSchedule(schedule)) {
        await scheduler.destroy(schedule);
      }
    }
    vi.useRealTimers();
  });

  describe('cron strings', () => {
    test('GIVEN a standard 5-field cron string THEN ticks on each matching minute', async () => {
      await run('* * * * *');

      await vi.advanceTimersByTimeAsync(3 * 60_000 + 500);

      expect(ticks()).toBe(3);
    });

    test('GIVEN a 6-field cron string with seconds THEN ticks on each matching second', async () => {
      await run('*/10 * * * * *');

      await vi.advanceTimersByTimeAsync(35_000);

      expect(ticks()).toBe(3);
    });

    test('GIVEN an invalid cron string THEN start rejects', async () => {
      await expect(run('not a cron')).rejects.toThrow();
    });
  });

  describe('milliseconds', () => {
    test('GIVEN a number of ms THEN ticks at exact millisecond spacing, starting one interval after start', async () => {
      await run(1500);

      await vi.advanceTimersByTimeAsync(1499);
      expect(ticks()).toBe(0);

      await vi.advanceTimersByTimeAsync(1);
      expect(ticks()).toBe(1);

      await vi.advanceTimersByTimeAsync(3000);
      expect(ticks()).toBe(3);
    });

    test('GIVEN an interval longer than the maximum timer delay THEN ticks only after the full interval', async () => {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      await run(thirtyDays);

      await vi.advanceTimersByTimeAsync(thirtyDays - 1);
      expect(ticks()).toBe(0);

      await vi.advanceTimersByTimeAsync(1);
      expect(ticks()).toBe(1);
    });

    test('GIVEN an interval of a minute or more THEN keeps its real spacing', async () => {
      await run(90_000);

      await vi.advanceTimersByTimeAsync(4 * 60_000);

      expect(ticks()).toBe(2);
    });

    test.each([0, -1000, Number.NaN, Number.POSITIVE_INFINITY])(
      'GIVEN an invalid amount of ms (%s) THEN start rejects with a RangeError',
      async (interval) => {
        await expect(run(interval)).rejects.toThrow(RangeError);
      },
    );
  });

  describe('dates', () => {
    test('GIVEN a future Date THEN ticks exactly once at that time', async () => {
      await run(new Date(START.getTime() + 5000));

      await vi.advanceTimersByTimeAsync(4500);
      expect(ticks()).toBe(0);

      await vi.advanceTimersByTimeAsync(60_000);
      expect(ticks()).toBe(1);
    });

    test('GIVEN an invalid Date THEN start rejects with a RangeError', async () => {
      await expect(run(new Date('not a date'))).rejects.toThrow(RangeError);
    });

    test.each([
      ['in the past', -5000],
      ['equal to now', 0],
    ])(
      'GIVEN a Date %s THEN start rejects with a RangeError',
      async (_label, offset) => {
        await expect(run(new Date(START.getTime() + offset))).rejects.toThrow(
          RangeError,
        );
        expect(scheduler.getJobs().size).toBe(0);
      },
    );

    test('GIVEN a past Date added through the manager THEN addSchedule rejects and nothing is kept', async () => {
      const manager = DefaultScheduleManager.create({
        bot: StubBot.create() as never,
      });
      const schedule = new MockSchedule(new Date(START.getTime() - 5000));

      await expect(manager.addSchedule(schedule)).rejects.toThrow(RangeError);

      expect(manager.getScheduleByID(schedule.getId())).toBeNull();
      expect(manager.getJobForSchedule(schedule)).toBeNull();
    });
  });
});
