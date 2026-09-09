import type { Metadata } from '@nyx-discord/types';
import {
  ScheduleMiddlewareError,
  UncaughtScheduleMiddlewareError,
} from '@nyx-discord/types';
import { describe, expect, it, test, vi } from 'vitest';
import { DefaultScheduleExecutor } from '../../../../src';
import { MockSchedule } from '../../mocks/MockSchedule';
import { StubScheduleErrorHandler } from '../../mocks/StubScheduleErrorHandler';
import { StubScheduleMiddleware } from '../../mocks/StubScheduleMiddleware';
import { StubScheduleMiddlewareList } from '../../mocks/StubScheduleMiddlewareList';

const createExecutor = (
  middleware = StubScheduleMiddlewareList.create(),
  errorHandler = StubScheduleErrorHandler.create(),
) => new DefaultScheduleExecutor(middleware, errorHandler);

describe('DefaultScheduleExecutor', () => {
  it('SHOULD create an instance of itself', () => {
    const executor = createExecutor();
    expect(executor).toBeInstanceOf(DefaultScheduleExecutor);
  });

  describe('getMiddleware', () => {
    test('GIVEN a constructor middleware THEN getMiddleware returns it', () => {
      const middleware = StubScheduleMiddlewareList.create();
      const executor = createExecutor(middleware);

      expect(executor.getMiddleware()).toBe(middleware);
    });
  });

  describe('getErrorHandler', () => {
    test('GIVEN a constructor error handler THEN getErrorHandler returns it', () => {
      const errorHandler = StubScheduleErrorHandler.create();
      const executor = createExecutor(undefined, errorHandler);

      expect(executor.getErrorHandler()).toBe(errorHandler);
    });
  });

  describe('tick', () => {
    test('GIVEN middleware allows THEN schedule.tick is called', async () => {
      const middleware = StubScheduleMiddlewareList.create(true);
      const errorHandler = StubScheduleErrorHandler.create();
      const executor = createExecutor(middleware, errorHandler);
      const schedule = new MockSchedule();
      const meta = {} as Metadata;

      await executor.tick(schedule, meta);

      expect(middleware.check).toHaveBeenCalledWith(schedule, meta);
      expect(schedule.tick).toHaveBeenCalledWith(meta);
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });

    test('GIVEN middleware blocks THEN schedule.tick is not called', async () => {
      const middleware = StubScheduleMiddlewareList.create(false);
      const executor = createExecutor(middleware);
      const schedule = new MockSchedule();
      const meta = {} as Metadata;

      await executor.tick(schedule, meta);

      expect(middleware.check).toHaveBeenCalledWith(schedule, meta);
      expect(schedule.tick).not.toHaveBeenCalled();
    });

    test('GIVEN middleware throws ScheduleMiddlewareError THEN error handler is called AND tick is skipped', async () => {
      const middleware = StubScheduleMiddlewareList.create(true);
      const errorHandler = StubScheduleErrorHandler.create();
      const executor = createExecutor(middleware, errorHandler);
      const schedule = new MockSchedule();
      const meta = {} as Metadata;

      const originalError = new Error('inner error');
      const middlewareError = new ScheduleMiddlewareError(
        originalError,
        StubScheduleMiddleware.create(),
        schedule,
        meta,
      );
      vi.mocked(middleware.check).mockRejectedValue(middlewareError);

      await executor.tick(schedule, meta);

      expect(errorHandler.handle).toHaveBeenCalledWith(
        middlewareError,
        schedule,
        [meta],
      );
      expect(schedule.tick).not.toHaveBeenCalled();
    });

    test('GIVEN middleware throws a non-ScheduleMiddlewareError THEN it is wrapped in UncaughtScheduleMiddlewareError AND tick is skipped', async () => {
      const middleware = StubScheduleMiddlewareList.create(true);
      const errorHandler = StubScheduleErrorHandler.create();
      const executor = createExecutor(middleware, errorHandler);
      const schedule = new MockSchedule();
      const meta = {} as Metadata;

      const originalError = new Error('uncaught middleware error');
      vi.mocked(middleware.check).mockRejectedValue(originalError);

      await executor.tick(schedule, meta);

      expect(errorHandler.handle).toHaveBeenCalled();
      const handledError = vi.mocked(errorHandler.handle).mock.calls[0]![0];
      expect(handledError).toBeInstanceOf(UncaughtScheduleMiddlewareError);
      expect(schedule.tick).not.toHaveBeenCalled();
    });

    test('GIVEN schedule.tick throws THEN error handler is called', async () => {
      const middleware = StubScheduleMiddlewareList.create(true);
      const errorHandler = StubScheduleErrorHandler.create();
      const executor = createExecutor(middleware, errorHandler);
      const schedule = new MockSchedule();
      const tickError = new Error('tick error');
      schedule.tick.mockRejectedValue(tickError);
      const meta = {} as Metadata;

      await executor.tick(schedule, meta);

      expect(errorHandler.handle).toHaveBeenCalledWith(
        tickError,
        schedule,
        [meta],
      );
    });

    test('GIVEN middleware blocks AND schedule.tick would throw THEN tick is skipped entirely', async () => {
      const middleware = StubScheduleMiddlewareList.create(false);
      const errorHandler = StubScheduleErrorHandler.create();
      const executor = createExecutor(middleware, errorHandler);
      const schedule = new MockSchedule();
      const tickError = new Error('tick error');
      schedule.tick.mockRejectedValue(tickError);
      const meta = {} as Metadata;

      await executor.tick(schedule, meta);

      expect(schedule.tick).not.toHaveBeenCalled();
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });
  });
});
