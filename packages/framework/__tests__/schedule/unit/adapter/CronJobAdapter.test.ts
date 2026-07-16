import type { ScheduleInterval } from '@nyx-discord/core';
import { describe, expect, it, test, vi } from 'vitest';
import { CronJobAdapter } from '../../../../src';

const createMockCronJob = (isActive = true) => ({
  stop: vi.fn().mockResolvedValue(undefined),
  start: vi.fn(),
  isActive,
});

describe('CronJobAdapter', () => {
  describe('constructor', () => {
    it('SHOULD create an instance of itself', () => {
      const job = createMockCronJob();
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      expect(adapter).toBeInstanceOf(CronJobAdapter);
    });
  });

  describe('isRunning', () => {
    test('GIVEN an active cron job THEN isRunning returns true', () => {
      const job = createMockCronJob(true);
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      expect(adapter.isRunning()).toBe(true);
    });

    test('GIVEN an inactive cron job THEN isRunning returns false', () => {
      const job = createMockCronJob(false);
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      expect(adapter.isRunning()).toBe(false);
    });
  });

  describe('pause', () => {
    test('GIVEN a running cron job THEN pause stops it', async () => {
      const job = createMockCronJob(true);
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      const result = await adapter.pause();

      expect(job.stop).toHaveBeenCalled();
      expect(result).toBe(adapter);
    });
  });

  describe('resume', () => {
    test('GIVEN a paused cron job THEN resume starts it', () => {
      const job = createMockCronJob(false);
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      const result = adapter.resume();

      expect(job.start).toHaveBeenCalled();
      expect(result).toBe(adapter);
    });
  });

  describe('destroy', () => {
    test('GIVEN a cron job THEN destroy stops it', async () => {
      const job = createMockCronJob(true);
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      const result = await adapter.destroy();

      expect(job.stop).toHaveBeenCalled();
      expect(result).toBe(adapter);
    });
  });

  describe('getInterval', () => {
    test('GIVEN an adapter with a cron interval THEN getInterval returns it', () => {
      const interval: ScheduleInterval = '*/10 * * * * *';
      const adapter = new CronJobAdapter(createMockCronJob() as never, interval);

      expect(adapter.getInterval()).toBe(interval);
    });

    test('GIVEN an adapter with a Date interval THEN getInterval returns it', () => {
      const date = new Date();
      const adapter = new CronJobAdapter(createMockCronJob() as never, date);

      expect(adapter.getInterval()).toBe(date);
    });
  });

  describe('getRaw', () => {
    test('GIVEN an adapter THEN getRaw returns the underlying cron job', () => {
      const job = createMockCronJob();
      const adapter = new CronJobAdapter(job as never, '*/5 * * * * *');

      expect(adapter.getRaw()).toBe(job);
    });
  });
});
