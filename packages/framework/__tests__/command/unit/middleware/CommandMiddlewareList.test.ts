import type { CommandMiddleware, MiddlewareResponse } from '@nyx-discord/core';
import { CommandMiddlewareError } from '@nyx-discord/core';
import { describe, expect, it, test, vi } from 'vitest';
import {
  CommandFilterCheckMiddleware,
  CommandMiddlewareList,
} from '../../../../src';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';

const createTrueResponse = (): MiddlewareResponse => ({
  allowed: true,
  checkNext: true,
});

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
      const list = CommandMiddlewareList.create();
      list.clear();

      const command = new MockStandaloneCommand();
      const result = await list.check(command);

      expect(result).toBe(true);
    });

    test('GIVEN a single middleware that allows THEN check returns true', async () => {
      const list = CommandMiddlewareList.create();
      list.clear();

      const mockMiddleware: CommandMiddleware = {
        check: vi.fn().mockResolvedValue(createTrueResponse()),
        getPriority: vi.fn().mockReturnValue(0),
        protect: vi.fn(),
        unprotect: vi.fn(),
        isProtected: vi.fn().mockReturnValue(false),
      };
      list.add(mockMiddleware);

      const command = new MockStandaloneCommand();
      const result = await list.check(command);

      expect(result).toBe(true);
      expect(mockMiddleware.check).toHaveBeenCalledOnce();
    });

    test('GIVEN a middleware that blocks THEN check returns false', async () => {
      const list = CommandMiddlewareList.create();
      list.clear();

      const mockMiddleware: CommandMiddleware = {
        check: vi
          .fn()
          .mockResolvedValue({ allowed: false, checkNext: false }),
        getPriority: vi.fn().mockReturnValue(0),
        protect: vi.fn(),
        unprotect: vi.fn(),
        isProtected: vi.fn().mockReturnValue(false),
      };
      list.add(mockMiddleware);

      const command = new MockStandaloneCommand();
      const result = await list.check(command);

      expect(result).toBe(false);
    });

    test('GIVEN a middleware that allows but stops chain THEN check returns true', async () => {
      const list = CommandMiddlewareList.create();
      list.clear();

      const firstMiddleware: CommandMiddleware = {
        check: vi
          .fn()
          .mockResolvedValue({ allowed: true, checkNext: false }),
        getPriority: vi.fn().mockReturnValue(1),
        protect: vi.fn(),
        unprotect: vi.fn(),
        isProtected: vi.fn().mockReturnValue(false),
      };
      const secondMiddleware: CommandMiddleware = {
        check: vi.fn().mockResolvedValue(createTrueResponse()),
        getPriority: vi.fn().mockReturnValue(0),
        protect: vi.fn(),
        unprotect: vi.fn(),
        isProtected: vi.fn().mockReturnValue(false),
      };
      list.add(firstMiddleware);
      list.add(secondMiddleware);

      const command = new MockStandaloneCommand();
      const result = await list.check(command);

      expect(result).toBe(true);
      expect(firstMiddleware.check).toHaveBeenCalledOnce();
      expect(secondMiddleware.check).not.toHaveBeenCalled();
    });
  });

  describe('wrapError', () => {
    test('GIVEN an error in middleware check THEN wraps it in a CommandMiddlewareError', () => {
      const list = new CommandMiddlewareList();
      list.clear();

      const mockMiddleware: CommandMiddleware = {
        check: vi.fn(),
        getPriority: vi.fn().mockReturnValue(0),
        protect: vi.fn(),
        unprotect: vi.fn(),
        isProtected: vi.fn().mockReturnValue(false),
      };
      const command = new MockStandaloneCommand();
      const originalError = new Error('Test error');

      const wrapped = (list as any).wrapError(
        mockMiddleware,
        originalError,
        command,
      );

      expect(wrapped).toBeInstanceOf(CommandMiddlewareError);
      expect(wrapped).toBeInstanceOf(Error);
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
    const mockMiddleware: CommandMiddleware = {
      check: vi.fn(),
      getPriority: vi.fn().mockReturnValue(0),
      protect: vi.fn(),
      unprotect: vi.fn(),
      isProtected: vi.fn().mockReturnValue(false),
    };

    const result = list.remove(mockMiddleware);
    expect(result).toBe(false);
  });
});
