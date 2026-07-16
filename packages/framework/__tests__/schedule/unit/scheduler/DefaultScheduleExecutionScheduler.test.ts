import { IllegalStateError, ObjectNotFoundError } from '@nyx-discord/core';
import { describe, expect, it, test, vi } from 'vitest';
import { DefaultScheduleExecutionScheduler } from '../../../../src';
import { MockSchedule } from '../../mocks/MockSchedule';
import { StubScheduleExecutor } from '../../mocks/StubScheduleExecutor';
import { StubScheduleMetadata } from '../../mocks/StubScheduleMetadata';

vi.mock('cron', () => {
  const mockCronJob = {
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockResolvedValue(undefined),
    isActive: true,
  };
  return {
    CronJob: {
      from: vi.fn().mockReturnValue(mockCronJob),
    },
  };
});

const createScheduler = () =>
  DefaultScheduleExecutionScheduler.create(
    StubScheduleExecutor.create(),
    StubScheduleMetadata.create(),
  );

describe('DefaultScheduleExecutionScheduler', () => {
  it('SHOULD create an instance of itself', () => {
    const scheduler = createScheduler();
    expect(scheduler).toBeInstanceOf(DefaultScheduleExecutionScheduler);
  });

  describe('onStart / onStop', () => {
    test('GIVEN a scheduler THEN onStart does not throw', () => {
      const scheduler = createScheduler();
      expect(() => scheduler.onStart()).not.toThrow();
    });

    test('GIVEN a scheduler THEN onStop does not throw', () => {
      const scheduler = createScheduler();
      expect(() => scheduler.onStop()).not.toThrow();
    });
  });

  describe('start', () => {
    test('GIVEN a schedule THEN a job is created and returned', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();

      const job = await scheduler.start(schedule);

      expect(job).toBeDefined();
      expect(scheduler.getJobForSchedule(schedule.getId())).toBe(job);
      expect(scheduler.getJobs().size).toBe(1);
    });

    test('GIVEN a duplicate schedule THEN IllegalStateError is thrown', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();
      await scheduler.start(schedule);

      await expect(() => scheduler.start(schedule)).rejects.toThrow(
        IllegalStateError,
      );
    });
  });

  describe('pause', () => {
    test('GIVEN a running schedule THEN it can be paused', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();
      await scheduler.start(schedule);

      const job = await scheduler.pause(schedule);

      expect(job).toBeDefined();
    });

    test('GIVEN a non-scheduled schedule THEN pause throws ObjectNotFoundError', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();

      await expect(() => scheduler.pause(schedule)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('destroy', () => {
    test('GIVEN a scheduled schedule THEN it can be destroyed', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();
      await scheduler.start(schedule);

      const result = await scheduler.destroy(schedule);

      expect(result).toBe(scheduler);
      expect(scheduler.getJobForSchedule(schedule.getId())).toBeNull();
      expect(scheduler.getJobs().size).toBe(0);
    });

    test('GIVEN a non-scheduled schedule THEN destroy throws ObjectNotFoundError', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();

      await expect(() => scheduler.destroy(schedule)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('getJobForSchedule', () => {
    test('GIVEN a schedule ID THEN getJobForSchedule returns the job', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();
      const job = await scheduler.start(schedule);

      const result = scheduler.getJobForSchedule(schedule.getId());

      expect(result).toBe(job);
    });

    test('GIVEN a schedule instance THEN getJobForSchedule returns the job', async () => {
      const scheduler = createScheduler();
      const schedule = new MockSchedule();
      const job = await scheduler.start(schedule);

      const result = scheduler.getJobForSchedule(schedule);

      expect(result).toBe(job);
    });

    test('GIVEN an unknown schedule THEN getJobForSchedule returns null', () => {
      const scheduler = createScheduler();

      const result = scheduler.getJobForSchedule(Symbol('unknown'));

      expect(result).toBeNull();
    });
  });

  describe('getJobs', () => {
    test('GIVEN no jobs THEN getJobs returns an empty collection', () => {
      const scheduler = createScheduler();

      expect(scheduler.getJobs().size).toBe(0);
    });

    test('GIVEN started schedules THEN getJobs returns them', async () => {
      const scheduler = createScheduler();
      const schedule1 = new MockSchedule();
      const schedule2 = new MockSchedule();
      await scheduler.start(schedule1);
      await scheduler.start(schedule2);

      expect(scheduler.getJobs().size).toBe(2);
    });
  });
});
