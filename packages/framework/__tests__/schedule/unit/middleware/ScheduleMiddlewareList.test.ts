import type { Metadata } from '@nyx-discord/core';
import { PriorityEnum, ScheduleMiddlewareError } from '@nyx-discord/core';
import { describe, expect, it, test, vi } from 'vitest';
import { ScheduleMiddlewareList } from '../../../../src';
import { MockSchedule } from '../../mocks/MockSchedule';
import { StubScheduleMiddleware } from '../../mocks/StubScheduleMiddleware';

describe('ScheduleMiddlewareList', () => {
  it('SHOULD create an instance of itself', () => {
    expect(ScheduleMiddlewareList.create()).toBeInstanceOf(
      ScheduleMiddlewareList,
    );
  });

  describe('static create', () => {
    test('GIVEN create is called THEN a filter check middleware is included', () => {
      const list = ScheduleMiddlewareList.create();
      const middlewares = list.getMiddlewares();

      expect(middlewares).toHaveLength(1);
    });
  });

  describe('add', () => {
    test('GIVEN a middleware is added THEN it appears in the list', () => {
      const list = new ScheduleMiddlewareList();
      const middleware = StubScheduleMiddleware.create();

      list.add(middleware);

      expect(list.getMiddlewares()).toContain(middleware);
    });

    test('GIVEN two middlewares with different priorities THEN higher priority is inserted first', () => {
      const list = new ScheduleMiddlewareList();
      const highPriority = StubScheduleMiddleware.create(
        { allowed: true, checkNext: true },
        PriorityEnum.High,
      );
      const normalPriority = StubScheduleMiddleware.create(
        { allowed: true, checkNext: true },
        PriorityEnum.Normal,
      );

      list.add(normalPriority);
      list.add(highPriority);

      const middlewares = list.getMiddlewares();
      expect(middlewares[0]).toBe(highPriority);
      expect(middlewares[1]).toBe(normalPriority);
    });
  });

  describe('remove', () => {
    test('GIVEN a middleware is removed THEN it is no longer in the list', () => {
      const list = new ScheduleMiddlewareList();
      const middleware = StubScheduleMiddleware.create();
      list.add(middleware);

      const result = list.remove(middleware);

      expect(result).toBe(true);
      expect(list.getMiddlewares()).not.toContain(middleware);
    });

    test('GIVEN a non-existing middleware THEN remove returns false', () => {
      const list = new ScheduleMiddlewareList();
      const middleware = StubScheduleMiddleware.create();

      const result = list.remove(middleware);

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    test('GIVEN middlewares in the list THEN clear removes all', () => {
      const list = new ScheduleMiddlewareList();
      list.add(StubScheduleMiddleware.create());
      list.add(StubScheduleMiddleware.create());

      list.clear();

      expect(list.getMiddlewares()).toHaveLength(0);
    });
  });

  describe('check', () => {
    test('GIVEN no middlewares THEN check returns true', async () => {
      const list = new ScheduleMiddlewareList();
      const schedule = new MockSchedule();

      const result = await list.check(schedule, {} as Metadata);

      expect(result).toBe(true);
    });

    test('GIVEN a middleware that allows THEN check returns true', async () => {
      const list = new ScheduleMiddlewareList();
      const middleware = StubScheduleMiddleware.create({
        allowed: true,
        checkNext: true,
      });
      list.add(middleware);
      const schedule = new MockSchedule();

      const result = await list.check(schedule, {} as Metadata);

      expect(result).toBe(true);
      expect(middleware.check).toHaveBeenCalledWith(schedule, {} as Metadata);
    });

    test('GIVEN a middleware that blocks THEN check returns false', async () => {
      const list = new ScheduleMiddlewareList();
      const middleware = StubScheduleMiddleware.create({
        allowed: false,
        checkNext: false,
      });
      list.add(middleware);
      const schedule = new MockSchedule();

      const result = await list.check(schedule, {} as Metadata);

      expect(result).toBe(false);
    });

    test('GIVEN a middleware that throws THEN check wraps in ScheduleMiddlewareError', async () => {
      const list = new ScheduleMiddlewareList();
      const originalError = new Error('Middleware failure');
      const middleware = StubScheduleMiddleware.create();
      vi.mocked(middleware.check).mockRejectedValue(originalError);
      list.add(middleware);
      const schedule = new MockSchedule();

      await expect(() => list.check(schedule, {} as Metadata)).rejects.toThrow(
        ScheduleMiddlewareError,
      );
    });
  });
});
