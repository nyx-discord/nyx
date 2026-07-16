import { ObjectNotFoundError } from '@nyx-discord/core';
import { describe, expect, test } from 'vitest';
import { MockSchedule } from '../../mocks/MockSchedule';
import { StubScheduleExecutionScheduler } from '../../mocks/StubScheduleExecutionScheduler';

describe('AbstractSchedule', () => {
  describe('getId', () => {
    test('GIVEN a schedule THEN getId returns its identifier', () => {
      const schedule = new MockSchedule();
      const id = schedule.getId();

      expect(id).toBeDefined();
      expect(typeof id).toBe('symbol');
    });
  });

  describe('getInterval', () => {
    test('GIVEN a schedule with a cron interval THEN getInterval returns it', () => {
      const interval = '*/10 * * * * *';
      const schedule = new MockSchedule(interval);

      expect(schedule.getInterval()).toBe(interval);
    });

    test('GIVEN a schedule with a Date interval THEN getInterval returns it', () => {
      const date = new Date();
      const schedule = new MockSchedule(date);

      expect(schedule.getInterval()).toBe(date);
    });
  });

  describe('getFilter', () => {
    test('GIVEN no filter THEN getFilter returns null', () => {
      const schedule = new MockSchedule();

      expect(schedule.getFilter()).toBeNull();
    });

    test('GIVEN a filter THEN getFilter returns it', async () => {
      const filter = { check: async () => true };
      const schedule = new MockSchedule(undefined, filter);

      expect(schedule.getFilter()).toBe(filter);
    });
  });

  describe('getMeta', () => {
    test('GIVEN a new schedule THEN getMeta returns a non-null object', () => {
      const schedule = new MockSchedule();
      const meta = schedule.getMeta();

      expect(meta).toBeDefined();
      expect(typeof meta).toBe('object');
    });
  });

  describe('onRegister / onUnregister', () => {
    test('GIVEN a schedule THEN onRegister does not throw', () => {
      const schedule = new MockSchedule();
      expect(() => schedule.onRegister()).not.toThrow();
    });

    test('GIVEN a schedule THEN onUnregister does not throw', () => {
      const schedule = new MockSchedule();
      expect(() => schedule.onUnregister()).not.toThrow();
    });
  });

  describe('getJob', () => {
    test('GIVEN a bot with a registered job THEN getJob returns it', () => {
      const schedule = new MockSchedule();
      const scheduler = StubScheduleExecutionScheduler.create();
      const adapter = scheduler.start({
        getId: () => schedule.getId(),
      } as never);
      const bot = {
        getScheduleManager: () => scheduler,
      };

      const job = schedule.getJob(bot as never, false);

      expect(job).toBe(adapter);
    });

    test('GIVEN no registered job AND force=true THEN throws ObjectNotFoundError', () => {
      const schedule = new MockSchedule();
      const scheduler = StubScheduleExecutionScheduler.create();
      const bot = {
        getScheduleManager: () => scheduler,
      };

      expect(() => schedule.getJob(bot as never)).toThrow(ObjectNotFoundError);
    });

    test('GIVEN no registered job AND force=false THEN returns null', () => {
      const schedule = new MockSchedule();
      const scheduler = StubScheduleExecutionScheduler.create();
      const bot = {
        getScheduleManager: () => scheduler,
      };

      const result = schedule.getJob(bot as never, false);

      expect(result).toBeNull();
    });
  });
});
