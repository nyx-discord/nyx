import { PriorityEnum } from '@nyx-discord/core';
import {
  describe,
  expect,
  it,
  test
} from 'vitest';
import {
  CommandFilterCheckMiddleware,
  CommandMiddlewareList,
} from '../../../../src';
import { StubMiddleware } from '../../mocks/StubMiddleware';
import { StubMetadata } from '../../mocks/StubMetadata';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';

describe('CommandMiddlewareList', () => {
  it('SHOULD create an instance of itself via create()', () => {
    const list = CommandMiddlewareList.create();

    expect(list).toBeInstanceOf(CommandMiddlewareList);
  });

  test('GIVEN create() THEN it contains a CommandFilterCheckMiddleware', () => {
    const list = CommandMiddlewareList.create();
    const middlewares = list.getMiddlewares();

    expect(middlewares.length).toBe(1);
    expect(middlewares[0]).toBeInstanceOf(CommandFilterCheckMiddleware);
  });

  describe('Middleware execution', () => {
    test('GIVEN no middleware added THEN check returns true', async () => {
      const command = new MockStandaloneCommand();
      const list = CommandMiddlewareList.create();
      list.clear();

      const result = await list.check(
        command,
        {} as never,
        StubMetadata.create(),
      );

      expect(result).toBe(true);
    });

    test('GIVEN a single middleware that allows THEN check returns true', async () => {
      const list = CommandMiddlewareList.create();
      list.clear();

      const mockMiddleware = StubMiddleware.create();
      list.add(mockMiddleware);

      const command = new MockStandaloneCommand();
      const result = await list.check(
        command,
        {} as never,
        StubMetadata.create(),
      );

      expect(result).toBe(true);
      expect(mockMiddleware.check).toHaveBeenCalledOnce();
    });

    test('GIVEN a middleware that blocks THEN check returns false', async () => {
      const list = CommandMiddlewareList.create();
      list.clear();

      const mockMiddleware = StubMiddleware.create({
        allowed: false,
        checkNext: false,
      });
      list.add(mockMiddleware);

      const command = new MockStandaloneCommand();
      const result = await list.check(
        command,
        {} as never,
        StubMetadata.create(),
      );

      expect(result).toBe(false);
    });

    test('GIVEN a middleware that allows but stops chain THEN check returns true', async () => {
      const list = CommandMiddlewareList.create();
      list.clear();

      const firstMiddleware = StubMiddleware.create(
        { allowed: true, checkNext: false },
        PriorityEnum.High,
      );
      const secondMiddleware = StubMiddleware.create(
        { allowed: true, checkNext: true },
        PriorityEnum.Low,
      );
      list.add(firstMiddleware);
      list.add(secondMiddleware);

      const command = new MockStandaloneCommand();
      const result = await list.check(
        command,
        {} as never,
        StubMetadata.create(),
      );

      expect(result).toBe(true);
      expect(firstMiddleware.check).toHaveBeenCalledOnce();
      expect(secondMiddleware.check).not.toHaveBeenCalled();
    });
  });

  test('GIVEN middleware list THEN clear empties all middlewares', () => {
    const list = CommandMiddlewareList.create();
    expect(list.getMiddlewares().length).toBe(1);

    list.clear();
    expect(list.getMiddlewares().length).toBe(0);
  });

  test('GIVEN middleware list THEN remove returns false for non-existing middleware', () => {
    const list = CommandMiddlewareList.create();
    const mockMiddleware = StubMiddleware.create();

    const result = list.remove(mockMiddleware);
    expect(result).toBe(false);
  });
});
