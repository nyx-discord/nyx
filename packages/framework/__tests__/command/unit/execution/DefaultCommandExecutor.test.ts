import type {
  CommandErrorHandler,
  CommandMiddleware,
  CommandMiddlewareResolvable,
  MiddlewareList,
  MiddlewareResponse,
} from '@nyx-discord/core';
import {
  CommandAutocompleteError,
  CommandMiddlewareError,
  UncaughtCommandMiddlewareError,
} from '@nyx-discord/core';
import { describe, expect, it, test, vi } from 'vitest';
import { DefaultCommandExecutor } from '../../../../src';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';

const createTrueResponse = (): MiddlewareResponse => ({
  allowed: true,
  checkNext: true,
});

const createFalseResponse = (): MiddlewareResponse => ({
  allowed: false,
  checkNext: false,
});

const createMockMiddleware = (
  response: MiddlewareResponse = createTrueResponse(),
): CommandMiddleware => ({
  check: vi.fn().mockResolvedValue(response),
  getPriority: vi.fn().mockReturnValue(0),
  protect: vi.fn(),
  unprotect: vi.fn(),
  isProtected: vi.fn().mockReturnValue(false),
});

describe('DefaultCommandExecutor', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultCommandExecutor.create()).toBeInstanceOf(
      DefaultCommandExecutor,
    );
  });

  describe('getErrorHandler', () => {
    test('GIVEN a created executor THEN has an error handler', () => {
      const executor = DefaultCommandExecutor.create();
      expect(executor.getErrorHandler()).toBeDefined();
    });
  });

  describe('getMiddleware', () => {
    test('GIVEN a created executor THEN has middleware list', () => {
      const executor = DefaultCommandExecutor.create();
      expect(executor.getMiddleware()).toBeDefined();
      expect(executor.getMiddleware().getMiddlewares().length).toBeGreaterThan(
        0,
      );
    });
  });

  describe('execute', () => {
    test('GIVEN a chat input interaction and standalone command THEN calls executeChatInput', async () => {
      const middleware: MiddlewareList<CommandMiddlewareResolvable> = {
        check: vi.fn().mockResolvedValue(true),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      const interaction = {
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isMessageComponent: vi.fn().mockReturnValue(false),
        isModalSubmit: vi.fn().mockReturnValue(false),
        isUserContextMenuCommand: vi.fn().mockReturnValue(false),
        isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
      } as any;
      const metadata = {};

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a chat input interaction and parent-type command THEN returns false', async () => {
      const middleware: MiddlewareList<CommandMiddlewareResolvable> = {
        check: vi.fn().mockResolvedValue(true),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      command.isStandalone = vi.fn().mockReturnValue(false);
      command.isSubCommand = vi.fn().mockReturnValue(false);

      const interaction = {
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isMessageComponent: vi.fn().mockReturnValue(false),
        isModalSubmit: vi.fn().mockReturnValue(false),
        isUserContextMenuCommand: vi.fn().mockReturnValue(false),
        isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
      } as any;
      const metadata = {};

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(false);
    });

    test('GIVEN a message component interaction THEN calls executeComponent', async () => {
      const middleware: MiddlewareList<CommandMiddlewareResolvable> = {
        check: vi.fn().mockResolvedValue(true),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      vi.spyOn(command, 'handleInteraction');
      const interaction = {
        isChatInputCommand: vi.fn().mockReturnValue(false),
        isMessageComponent: vi.fn().mockReturnValue(true),
        isModalSubmit: vi.fn().mockReturnValue(false),
        isUserContextMenuCommand: vi.fn().mockReturnValue(false),
        isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
      } as any;
      const metadata = {};

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.handleInteraction).toHaveBeenCalledWith(
        interaction,
        metadata,
      );
    });
  });

  describe('autocomplete', () => {
    test('GIVEN a command that autocompletes successfully THEN does not call error handler', async () => {
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const middleware: MiddlewareList<CommandMiddlewareResolvable> = {
        check: vi.fn().mockResolvedValue(true),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      command.autocomplete = vi.fn();
      const interaction = {} as any;
      const metadata = {};

      await executor.autocomplete(command, interaction, metadata);

      expect(command.autocomplete).toHaveBeenCalledWith(interaction, metadata);
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });

    test('GIVEN autocomplete throws THEN error handler is called with CommandAutocompleteError', async () => {
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const middleware: MiddlewareList<CommandMiddlewareResolvable> = {
        check: vi.fn().mockResolvedValue(true),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      const error = new Error('Autocomplete failed');
      command.autocomplete = vi.fn().mockRejectedValue(error);
      const interaction = {} as any;
      const metadata = {};

      await executor.autocomplete(command, interaction, metadata);

      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const handledError = (errorHandler.handle as any).mock.calls[0][0];
      expect(handledError).toBeInstanceOf(CommandAutocompleteError);
    });
  });

  describe('checkMiddleware', () => {
    test('GIVEN middleware throws a generic error THEN wraps it in UncaughtCommandMiddlewareError', async () => {
      const genericError = new Error('Generic middleware error');
      const middleware: MiddlewareList<CommandMiddleware> = {
        check: vi.fn().mockRejectedValue(genericError),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      const interaction = {} as any;
      const metadata = {};

      const result = await (executor as any).checkMiddleware(
        command,
        interaction,
        metadata,
      );

      expect(result).toBe(false);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const handledError = (errorHandler.handle as any).mock.calls[0][0];
      expect(handledError).toBeInstanceOf(UncaughtCommandMiddlewareError);
    });

    test('GIVEN middleware throws a CommandMiddlewareError THEN passes it through', async () => {
      const originalError = new Error('Original');
      const mockMw = createMockMiddleware();
      const command = new MockStandaloneCommand();
      const interaction = {} as any;
      const metadata = {};
      const cmdError = new CommandMiddlewareError(
        originalError,
        mockMw,
        command,
        interaction,
        metadata,
      );
      const middleware: MiddlewareList<CommandMiddleware> = {
        check: vi.fn().mockRejectedValue(cmdError),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const result = await (executor as any).checkMiddleware(
        command,
        interaction,
        metadata,
      );

      expect(result).toBe(false);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const handledError = (errorHandler.handle as any).mock.calls[0][0];
      expect(handledError).toBe(cmdError);
    });

    test('GIVEN middleware check succeeds THEN returns true without calling error handler', async () => {
      const middleware: MiddlewareList<CommandMiddleware> = {
        check: vi.fn().mockResolvedValue(true),
        add: vi.fn(),
        clear: vi.fn(),
        remove: vi.fn().mockReturnValue(false),
        getMiddlewares: vi.fn().mockReturnValue([]),
      };
      const errorHandler: CommandErrorHandler = {
        handle: vi.fn(),
      };
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      } as any);

      const command = new MockStandaloneCommand();
      const interaction = {} as any;
      const metadata = {};

      const result = await (executor as any).checkMiddleware(
        command,
        interaction,
        metadata,
      );

      expect(result).toBe(true);
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });
  });
});
