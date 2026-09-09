import {
  CommandAutocompleteError,
  CommandMiddlewareError,
  UncaughtCommandMiddlewareError,
} from '@nyx-discord/types';
import { describe, expect, it, test, vi } from 'vitest';
import { DefaultCommandExecutor } from '../../../../src';
import { MockContextMenuCommand } from '../../mocks/MockContextMenuCommand';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { StubErrorHandler } from '../../mocks/StubErrorHandler';
import { StubInteraction } from '../../mocks/StubInteraction';
import { StubMetadata } from '../../mocks/StubMetadata';
import { StubMiddlewareList } from '../../mocks/StubMiddlewareList';
import type { CommandMiddleware } from '@nyx-discord/types';
import type { DjsInteractionTypes } from '../../../../src/types/DjsInteractionTypes.js';

describe('DefaultCommandExecutor', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultCommandExecutor.create()).toBeInstanceOf(
      DefaultCommandExecutor,
    );
  });

  test('GIVEN custom injections THEN uses injected errorHandler and middleware', () => {
    const errorHandler = StubErrorHandler.create();
    const middleware = StubMiddlewareList.create();
    const executor = DefaultCommandExecutor.create({
      injections: {
        errorHandler,
        middleware,
      },
    });

    expect(executor.getErrorHandler()).toBe(errorHandler);
    expect(executor.getMiddleware()).toBe(middleware);
  });

  describe('getErrorHandler and getMiddleware', () => {
    test('GIVEN default create THEN initializes valid error handler and middleware', () => {
      const executor = DefaultCommandExecutor.create();
      expect(executor.getErrorHandler()).toBeDefined();
      expect(executor.getMiddleware()).toBeDefined();
    });
  });

  describe('execute', () => {
    test('GIVEN a chat input interaction and standalone command THEN executes command and returns true', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a chat input interaction and subcommand THEN executes command and returns true', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const parent = new MockParentCommand();
      const command = new MockSubCommand(parent);
      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a chat input interaction and parent command THEN returns false', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const parent = new MockParentCommand();
      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      const result = await executor.execute(parent as never, interaction, metadata);

      expect(result).toBe(false);
    });

    test('GIVEN a message component (button) interaction THEN calls handleInteraction and returns true', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const spyHandle = vi.spyOn(command, 'handleInteraction');
      const interaction = StubInteraction.createButton();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(spyHandle).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a modal submit interaction THEN calls handleInteraction and returns true', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const spyHandle = vi.spyOn(command, 'handleInteraction');
      const interaction = StubInteraction.createModalSubmit();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(spyHandle).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a user context menu interaction and context menu command THEN executes command and returns true', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockContextMenuCommand();
      const interaction = StubInteraction.createUserContextMenu();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a user context menu interaction on non-context-menu command THEN returns false', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createUserContextMenu();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(false);
    });

    test('GIVEN a message context menu interaction and context menu command THEN executes command and returns true', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockContextMenuCommand();
      const interaction = StubInteraction.createMessageContextMenu();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a message context menu interaction on non-context-menu command THEN returns false', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createMessageContextMenu();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(false);
    });

    test('GIVEN an unknown interaction type THEN returns false', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createUnknown();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(false);
    });
  });

  describe('middleware handling', () => {
    test('GIVEN middleware returns false THEN command method is not executed', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      vi.mocked(middleware.check).mockResolvedValue(false);

      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      await executor.executeChatInput(command, interaction as never, metadata);

      expect(command.execute).not.toHaveBeenCalled();
    });

    test('GIVEN middleware throws generic Error THEN wraps in UncaughtCommandMiddlewareError and calls error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const rawError = new Error('Middleware failed');
      vi.mocked(middleware.check).mockRejectedValue(rawError);

      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      await executor.executeChatInput(command, interaction as never, metadata);

      expect(command.execute).not.toHaveBeenCalled();
      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const passedError = vi.mocked(errorHandler.handle).mock.calls[0]![0];
      expect(passedError).toBeInstanceOf(UncaughtCommandMiddlewareError);
    });

    test('GIVEN middleware throws CommandMiddlewareError THEN passes original error directly to error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const command = new MockStandaloneCommand();
      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      const customMiddlewareError = new (class extends CommandMiddlewareError {
        constructor() {
          super(
            new Error('custom'),
            middleware as unknown as CommandMiddleware<DjsInteractionTypes>,
            command,
            interaction,
            metadata,
          );
        }
      })();

      vi.mocked(middleware.check).mockRejectedValue(customMiddlewareError);

      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      await executor.executeChatInput(command, interaction as never, metadata);

      expect(command.execute).not.toHaveBeenCalled();
      expect(errorHandler.handle).toHaveBeenCalledWith(
        customMiddlewareError,
        command,
        [interaction, metadata],
      );
    });
  });

  describe('command execution error handling', () => {
    test('GIVEN command method throws THEN error is forwarded to error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const commandError = new Error('Command failed');
      vi.mocked(command.execute).mockRejectedValue(commandError);

      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      await executor.executeChatInput(command, interaction as never, metadata);

      expect(errorHandler.handle).toHaveBeenCalledWith(commandError, command, [
        interaction,
        metadata,
      ]);
    });

    test('GIVEN command method throws a raw string THEN error is wrapped into an Error object and forwarded to error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const rawError = 'My string rejection';
      vi.mocked(command.execute).mockRejectedValue(rawError);

      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      await executor.executeChatInput(command, interaction as never, metadata);

      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const passedError = vi.mocked(errorHandler.handle).mock.calls[0]![0];
      expect(passedError).toBeInstanceOf(Error);
      expect((passedError as Error).message).toBe(rawError);
    });

    test('GIVEN command method throws null THEN error is wrapped into an Error object and forwarded to error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      vi.mocked(command.execute).mockRejectedValue(null);

      const interaction = StubInteraction.createChatInput();
      const metadata = StubMetadata.create();

      await executor.executeChatInput(command, interaction as never, metadata);

      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const passedError = vi.mocked(errorHandler.handle).mock.calls[0]![0];
      expect(passedError).toBeInstanceOf(Error);
      expect((passedError as Error).message).toBe('null');
    });
  });

  describe('autocomplete', () => {
    test('GIVEN command autocomplete succeeds THEN does not invoke error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const spyAutocomplete = vi.spyOn(command, 'autocomplete').mockResolvedValue(undefined);
      const interaction = StubInteraction.createAutocomplete();
      const metadata = StubMetadata.create();

      await executor.autocomplete(command, interaction, metadata);

      expect(spyAutocomplete).toHaveBeenCalledWith(interaction, metadata);
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });

    test('GIVEN command autocomplete throws THEN wraps in CommandAutocompleteError and invokes error handler', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const autocompleteError = new Error('Autocomplete failed');
      vi.spyOn(command, 'autocomplete').mockRejectedValue(autocompleteError);

      const interaction = StubInteraction.createAutocomplete();
      const metadata = StubMetadata.create();

      await executor.autocomplete(command, interaction, metadata);

      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const passedError = vi.mocked(errorHandler.handle).mock.calls[0]![0];
      expect(passedError).toBeInstanceOf(CommandAutocompleteError);
    });
  });

  describe('direct execution methods', () => {
    test('GIVEN executeUser THEN invokes command.execute', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockContextMenuCommand();
      const interaction = StubInteraction.createUserContextMenu();
      const metadata = StubMetadata.create();

      await executor.executeUser(command, interaction, metadata);

      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN executeMessage THEN invokes command.execute', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockContextMenuCommand();
      const interaction = StubInteraction.createMessageContextMenu();
      const metadata = StubMetadata.create();

      await executor.executeMessage(command, interaction, metadata);

      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN executeComponent THEN invokes command.handleInteraction', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const spyHandle = vi.spyOn(command, 'handleInteraction');
      const interaction = StubInteraction.createButton();
      const metadata = StubMetadata.create();

      await executor.executeComponent(command, interaction, metadata);

      expect(spyHandle).toHaveBeenCalledWith(interaction, metadata);
    });
  });
});
