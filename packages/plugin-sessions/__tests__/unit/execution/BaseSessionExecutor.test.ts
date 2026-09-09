import {
  BaseSessionExecutor,
  SessionEndCodes,
  SessionStartError,
  SessionStartMiddlewareError,
  SessionStopError,
  SessionUpdateError,
  SessionUpdateMiddlewareError,
  UncaughtSessionStartMiddlewareError,
  UncaughtSessionUpdateMiddlewareError,
} from '#src';
import { IllegalStateError } from '@nyx-discord/types';
import {
  ComponentType,
  type APIMessageTopLevelComponent,
} from 'discord-api-types/v10';
import { describe, expect, test, vi } from 'vitest';

class TestSessionExecutor extends BaseSessionExecutor<any> {
  public rawComponents: APIMessageTopLevelComponent[] = [];
  public updatedComponents: APIMessageTopLevelComponent[] = [];

  protected override getRawComponentRows(): APIMessageTopLevelComponent[] {
    return this.rawComponents;
  }

  protected override async updateInteraction(
    _interaction: any,
    components: APIMessageTopLevelComponent[],
  ): Promise<void> {
    this.updatedComponents = components;
  }
}

function createExecutor(
  overrides: {
    startMiddleware?: any;
    updateMiddleware?: any;
    startErrorHandler?: any;
    updateErrorHandler?: any;
    endErrorHandler?: any;
  } = {},
) {
  const startMiddleware = overrides.startMiddleware ?? {
    check: vi.fn().mockResolvedValue(true),
  };
  const updateMiddleware = overrides.updateMiddleware ?? {
    check: vi.fn().mockResolvedValue(true),
  };
  const startErrorHandler = overrides.startErrorHandler ?? {
    handle: vi.fn().mockResolvedValue(undefined),
  };
  const updateErrorHandler = overrides.updateErrorHandler ?? {
    handle: vi.fn().mockResolvedValue(undefined),
  };
  const endErrorHandler = overrides.endErrorHandler ?? {
    handle: vi.fn().mockResolvedValue(undefined),
  };

  const executor = new TestSessionExecutor(
    startMiddleware,
    updateMiddleware,
    startErrorHandler,
    updateErrorHandler,
    endErrorHandler,
  );

  return {
    executor,
    startMiddleware,
    updateMiddleware,
    startErrorHandler,
    updateErrorHandler,
    endErrorHandler,
  };
}

function createMockSession(
  state: 'uninitialized' | 'running' | 'ended' = 'uninitialized',
  replied = false,
  result: unknown = null,
) {
  const startInteraction = {
    id: 'start-interaction-1',
    user: { id: 'user-1' },
    guildId: 'guild-1',
    channelId: 'channel-1',
    replied,
  };

  return {
    getId: vi.fn().mockReturnValue('session-1'),
    getState: vi.fn().mockReturnValue(state),
    setState: vi.fn(),
    onStart: vi.fn().mockResolvedValue(undefined),
    onUpdate: vi.fn().mockResolvedValue(true),
    onEnd: vi.fn().mockResolvedValue(undefined),
    getResult: vi.fn().mockReturnValue(result),
    hasReplied: vi.fn().mockReturnValue(replied),
    getStartInteraction: vi.fn().mockReturnValue(startInteraction),
  } as any;
}

describe('BaseSessionExecutor', () => {
  describe('start', () => {
    test('GIVEN an already initialized session THEN throws IllegalStateError', async () => {
      const { executor } = createExecutor();
      const session = createMockSession('running');

      await expect(executor.start(session, {} as any)).rejects.toThrow(
        IllegalStateError,
      );
    });

    test('GIVEN valid uninitialized session AND passing start middleware THEN calls onStart and returns true', async () => {
      const { executor, startMiddleware } = createExecutor();
      const session = createMockSession('uninitialized');
      const meta = { test: true } as any;

      const result = await executor.start(session, meta);

      expect(result).toBe(true);
      expect(startMiddleware.check).toHaveBeenCalledWith(session, meta);
      expect(session.onStart).toHaveBeenCalledWith(meta);
    });

    test('GIVEN start middleware returning false THEN skips onStart and returns false', async () => {
      const { executor, startMiddleware } = createExecutor({
        startMiddleware: { check: vi.fn().mockResolvedValue(false) },
      });
      const session = createMockSession('uninitialized');
      const meta = {} as any;

      const result = await executor.start(session, meta);

      expect(result).toBe(false);
      expect(startMiddleware.check).toHaveBeenCalledWith(session, meta);
      expect(session.onStart).not.toHaveBeenCalled();
    });

    test('GIVEN start middleware throwing generic Error THEN wraps into UncaughtSessionStartMiddlewareError, calls startErrorHandler, and returns false', async () => {
      const middlewareError = new Error('Middleware boom');
      const { executor, startErrorHandler } = createExecutor({
        startMiddleware: { check: vi.fn().mockRejectedValue(middlewareError) },
      });
      const session = createMockSession('uninitialized');
      const meta = {} as any;

      const result = await executor.start(session, meta);

      expect(result).toBe(false);
      expect(startErrorHandler.handle).toHaveBeenCalledOnce();
      const [wrappedError, targetSession, args] =
        startErrorHandler.handle.mock.calls[0];
      expect(wrappedError).toBeInstanceOf(UncaughtSessionStartMiddlewareError);
      expect(wrappedError.getError()).toBe(middlewareError);
      expect(targetSession).toBe(session);
      expect(args).toEqual([meta]);
      expect(session.onStart).not.toHaveBeenCalled();
    });

    test('GIVEN start middleware throwing SessionStartMiddlewareError THEN passes directly to startErrorHandler without re-wrapping', async () => {
      const session = createMockSession('uninitialized');
      const customError = new SessionStartMiddlewareError(
        new Error('Custom error'),
        {} as any,
        session,
        {} as any,
      );
      const { executor, startErrorHandler } = createExecutor({
        startMiddleware: { check: vi.fn().mockRejectedValue(customError) },
      });

      const result = await executor.start(session, {} as any);

      expect(result).toBe(false);
      expect(startErrorHandler.handle).toHaveBeenCalledWith(
        customError,
        session,
        [{}],
      );
    });

    test('GIVEN onStart throwing generic Error when replied is false THEN wraps into SessionStartError, calls startErrorHandler, and returns false', async () => {
      const onStartError = new Error('Start failed');
      const { executor, startErrorHandler } = createExecutor();
      const session = createMockSession('uninitialized', false);
      session.onStart.mockRejectedValue(onStartError);
      const meta = {} as any;

      const result = await executor.start(session, meta);

      expect(result).toBe(false);
      expect(startErrorHandler.handle).toHaveBeenCalledOnce();
      const [wrappedError, targetSession, args] =
        startErrorHandler.handle.mock.calls[0];
      expect(wrappedError).toBeInstanceOf(SessionStartError);
      expect(wrappedError.getError()).toBe(onStartError);
      expect(targetSession).toBe(session);
      expect(args).toEqual([meta]);
    });

    test('GIVEN onStart throwing generic Error when replied is true THEN wraps into SessionStartError, calls startErrorHandler, and returns true', async () => {
      const onStartError = new Error('Start failed after reply');
      const { executor, startErrorHandler } = createExecutor();
      const session = createMockSession('uninitialized', true);
      session.onStart.mockRejectedValue(onStartError);
      const meta = {} as any;

      const result = await executor.start(session, meta);

      expect(result).toBe(true);
      expect(startErrorHandler.handle).toHaveBeenCalledOnce();
      expect(startErrorHandler.handle.mock.calls[0][0]).toBeInstanceOf(
        SessionStartError,
      );
    });

    test('GIVEN onStart throwing BaseSessionError subclass THEN passes directly to startErrorHandler without re-wrapping', async () => {
      const session = createMockSession('uninitialized', false);
      const customSessionError = new SessionStartError(
        new Error('Custom session error'),
        session,
        {} as any,
      );
      const { executor, startErrorHandler } = createExecutor();
      session.onStart.mockRejectedValue(customSessionError);

      const result = await executor.start(session, {} as any);

      expect(result).toBe(false);
      expect(startErrorHandler.handle).toHaveBeenCalledWith(
        customSessionError,
        session,
        [{}],
      );
    });
  });

  describe('update', () => {
    test('GIVEN session not in running state THEN throws IllegalStateError', async () => {
      const { executor } = createExecutor();
      const uninitSession = createMockSession('uninitialized');
      const endedSession = createMockSession('ended');

      await expect(
        executor.update(uninitSession, {} as any, {} as any),
      ).rejects.toThrow(IllegalStateError);
      await expect(
        executor.update(endedSession, {} as any, {} as any),
      ).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN running session AND passing update middleware THEN calls onUpdate and returns result', async () => {
      const { executor, updateMiddleware } = createExecutor();
      const session = createMockSession('running');
      session.onUpdate.mockResolvedValue(true);
      const interaction = { id: 'interaction-1' } as any;
      const meta = { updateMeta: true } as any;

      const result = await executor.update(session, interaction, meta);

      expect(result).toBe(true);
      expect(updateMiddleware.check).toHaveBeenCalledWith(
        session,
        interaction,
        meta,
      );
      expect(session.onUpdate).toHaveBeenCalledWith(interaction, meta);
    });

    test('GIVEN update middleware returning false THEN skips onUpdate and returns false', async () => {
      const { executor } = createExecutor({
        updateMiddleware: { check: vi.fn().mockResolvedValue(false) },
      });
      const session = createMockSession('running');
      const interaction = {} as any;

      const result = await executor.update(session, interaction, {} as any);

      expect(result).toBe(false);
      expect(session.onUpdate).not.toHaveBeenCalled();
    });

    test('GIVEN update middleware throwing generic Error THEN wraps into UncaughtSessionUpdateMiddlewareError, calls updateErrorHandler, and returns false', async () => {
      const middlewareError = new Error('Update middleware boom');
      const { executor, updateErrorHandler } = createExecutor({
        updateMiddleware: { check: vi.fn().mockRejectedValue(middlewareError) },
      });
      const session = createMockSession('running');
      const interaction = {} as any;
      const meta = {} as any;

      const result = await executor.update(session, interaction, meta);

      expect(result).toBe(false);
      expect(updateErrorHandler.handle).toHaveBeenCalledOnce();
      const [wrappedError, targetSession, args] =
        updateErrorHandler.handle.mock.calls[0];
      expect(wrappedError).toBeInstanceOf(UncaughtSessionUpdateMiddlewareError);
      expect(wrappedError.getError()).toBe(middlewareError);
      expect(targetSession).toBe(session);
      expect(args).toEqual([interaction, meta]);
      expect(session.onUpdate).not.toHaveBeenCalled();
    });

    test('GIVEN update middleware throwing SessionUpdateMiddlewareError THEN passes directly to updateErrorHandler', async () => {
      const customError = new SessionUpdateMiddlewareError(
        new Error('Custom update middleware error'),
        {} as any,
        {} as any,
        {} as any,
        {} as any,
      );
      const { executor, updateErrorHandler } = createExecutor({
        updateMiddleware: { check: vi.fn().mockRejectedValue(customError) },
      });
      const session = createMockSession('running');
      const interaction = {} as any;
      const meta = {} as any;

      const result = await executor.update(session, interaction, meta);

      expect(result).toBe(false);
      expect(updateErrorHandler.handle).toHaveBeenCalledWith(
        customError,
        session,
        [interaction, meta],
      );
    });

    test('GIVEN onUpdate throwing generic Error THEN wraps into SessionUpdateError, calls updateErrorHandler, and returns false', async () => {
      const onUpdateError = new Error('onUpdate failed');
      const { executor, updateErrorHandler } = createExecutor();
      const session = createMockSession('running');
      session.onUpdate.mockRejectedValue(onUpdateError);
      const interaction = {} as any;
      const meta = {} as any;

      const result = await executor.update(session, interaction, meta);

      expect(result).toBe(false);
      expect(updateErrorHandler.handle).toHaveBeenCalledOnce();
      const [wrappedError, targetSession, args] =
        updateErrorHandler.handle.mock.calls[0];
      expect(wrappedError).toBeInstanceOf(SessionUpdateError);
      expect(wrappedError.getError()).toBe(onUpdateError);
      expect(targetSession).toBe(session);
      expect(args).toEqual([interaction, meta]);
    });

    test('GIVEN onUpdate throwing BaseSessionError THEN passes directly to updateErrorHandler', async () => {
      const customError = new SessionUpdateError(
        new Error('Custom update error'),
        {} as any,
        {} as any,
        {} as any,
      );
      const { executor, updateErrorHandler } = createExecutor();
      const session = createMockSession('running');
      session.onUpdate.mockRejectedValue(customError);
      const interaction = {} as any;
      const meta = {} as any;

      const result = await executor.update(session, interaction, meta);

      expect(result).toBe(false);
      expect(updateErrorHandler.handle).toHaveBeenCalledWith(
        customError,
        session,
        [interaction, meta],
      );
    });
  });

  describe('end', () => {
    test('GIVEN session not in running state THEN throws IllegalStateError', async () => {
      const { executor } = createExecutor();
      const uninitSession = createMockSession('uninitialized');
      const endedSession = createMockSession('ended');

      await expect(
        executor.end(
          uninitSession,
          'reason',
          SessionEndCodes.SelfEnded,
          {} as any,
        ),
      ).rejects.toThrow(IllegalStateError);

      await expect(
        executor.end(
          endedSession,
          'reason',
          SessionEndCodes.SelfEnded,
          {} as any,
        ),
      ).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN running session THEN calls onEnd, populates result from getResult(), and returns SessionEndData', async () => {
      const { executor } = createExecutor();
      const expectedResult = { score: 100 };
      const session = createMockSession('running', false, expectedResult);
      const meta = { endMeta: true } as any;

      const endData = await executor.end(
        session,
        'Finished normally',
        SessionEndCodes.SelfEnded,
        meta,
      );

      expect(session.onEnd).toHaveBeenCalledWith(
        'Finished normally',
        SessionEndCodes.SelfEnded,
        meta,
      );
      expect(endData).toEqual({
        reason: 'Finished normally',
        code: SessionEndCodes.SelfEnded,
        result: expectedResult,
      });
    });

    test('GIVEN onEnd throwing generic Error THEN wraps into SessionStopError, calls endErrorHandler, and still returns SessionEndData', async () => {
      const onEndError = new Error('onEnd failed');
      const { executor, endErrorHandler } = createExecutor();
      const session = createMockSession('running');
      session.onEnd.mockRejectedValue(onEndError);
      const meta = {} as any;

      const endData = await executor.end(
        session,
        'Failed reason',
        SessionEndCodes.SelfEnded,
        meta,
      );

      expect(endErrorHandler.handle).toHaveBeenCalledOnce();
      const [wrappedError, targetSession, args] =
        endErrorHandler.handle.mock.calls[0];
      expect(wrappedError).toBeInstanceOf(SessionStopError);
      expect(wrappedError.getError()).toBe(onEndError);
      expect(targetSession).toBe(session);
      expect(args).toEqual([endData, meta]);
      expect(endData.reason).toBe('Failed reason');
      expect(endData.code).toBe(SessionEndCodes.SelfEnded);
    });

    test('GIVEN onEnd throwing BaseSessionError THEN passes directly to endErrorHandler and returns SessionEndData', async () => {
      const customError = new SessionStopError(
        new Error('Custom stop error'),
        {} as any,
        {} as any,
        null,
        {} as any,
      );
      const { executor, endErrorHandler } = createExecutor();
      const session = createMockSession('running');
      session.onEnd.mockRejectedValue(customError);
      const meta = {} as any;

      const endData = await executor.end(
        session,
        'Custom reason',
        SessionEndCodes.SelfEnded,
        meta,
      );

      expect(endErrorHandler.handle).toHaveBeenCalledWith(
        customError,
        session,
        [endData, meta],
      );
      expect(endData).toEqual({
        reason: 'Custom reason',
        code: SessionEndCodes.SelfEnded,
        result: null,
      });
    });
  });

  describe('getters', () => {
    test('GIVEN executor THEN getters return injected middlewares and error handlers', () => {
      const {
        executor,
        startMiddleware,
        updateMiddleware,
        startErrorHandler,
        updateErrorHandler,
        endErrorHandler,
      } = createExecutor();

      expect(executor.getStartMiddleware()).toBe(startMiddleware);
      expect(executor.getUpdateMiddleware()).toBe(updateMiddleware);
      expect(executor.getStartErrorHandler()).toBe(startErrorHandler);
      expect(executor.getUpdateErrorHandler()).toBe(updateErrorHandler);
      expect(executor.getEndErrorHandler()).toBe(endErrorHandler);
    });
  });

  describe('handleMissing and setMissingHandler', () => {
    test('GIVEN handleMissing called THEN extracts rows, disables interactive components, and calls updateInteraction', async () => {
      const { executor } = createExecutor();
      executor.rawComponents = [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              custom_id: 'btn_1',
              style: 1,
              label: 'Click',
              disabled: false,
            } as any,
          ],
        },
      ];

      const interaction = { id: 'missing-interaction' } as any;
      await executor.handleMissing('session-x', interaction);

      expect(executor.updatedComponents).toEqual([
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              custom_id: 'btn_1',
              style: 1,
              label: 'Click',
              disabled: true,
            },
          ],
        },
      ]);
    });

    test('GIVEN custom missing handler via setMissingHandler THEN handleMissing invokes custom handler', async () => {
      const { executor } = createExecutor();
      const customHandler = vi.fn().mockResolvedValue(undefined);

      executor.setMissingHandler(customHandler);

      const interaction = { id: 'custom-interaction' } as any;
      await executor.handleMissing('session-custom', interaction);

      expect(customHandler).toHaveBeenCalledWith('session-custom', interaction);
    });
  });
});
