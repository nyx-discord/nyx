import { CommandAutocompleteError } from '@nyx-discord/core';
import { describe, expect, it, test, vi } from 'vitest';
import { DefaultCommandExecutor } from '../../../../src';
import { StubErrorHandler } from '../../mocks/StubErrorHandler';
import { StubMetadata } from '../../mocks/StubMetadata';
import { StubMiddlewareList } from '../../mocks/StubMiddlewareList';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { StubInteractionFactory } from '../../mocks/StubInteractionFactory';

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
      const middleware = StubMiddlewareList.create();
      const errorHandler = StubErrorHandler.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const interaction = StubInteractionFactory.createChatInput();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(true);
      expect(command.execute).toHaveBeenCalledWith(interaction, metadata);
    });

    test('GIVEN a chat input interaction and parent-type command THEN returns false', async () => {
      const middleware = StubMiddlewareList.create();
      const errorHandler = StubErrorHandler.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      vi.spyOn(command, 'isStandalone').mockReturnValue(false);
      vi.spyOn(command, 'isSubCommand').mockReturnValue(false);

      const interaction = StubInteractionFactory.createChatInput();
      const metadata = StubMetadata.create();

      const result = await executor.execute(command, interaction, metadata);

      expect(result).toBe(false);
    });

    test('GIVEN a message component interaction THEN calls executeComponent', async () => {
      const middleware = StubMiddlewareList.create();
      const errorHandler = StubErrorHandler.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      vi.spyOn(command, 'handleInteraction');
      const interaction = StubInteractionFactory.createButton();
      const metadata = StubMetadata.create();

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
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      vi.spyOn(command, 'autocomplete').mockResolvedValue(undefined);
      const interaction = StubInteractionFactory.createAutocomplete();
      const metadata = StubMetadata.create();

      await executor.autocomplete(command, interaction, metadata);

      expect(command.autocomplete).toHaveBeenCalledWith(interaction, metadata);
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });

    test('GIVEN autocomplete throws THEN error handler is called with CommandAutocompleteError', async () => {
      const errorHandler = StubErrorHandler.create();
      const middleware = StubMiddlewareList.create();
      const executor = new DefaultCommandExecutor({
        errorHandler,
        middleware,
      });

      const command = new MockStandaloneCommand();
      const error = new Error('Autocomplete failed');
      vi.spyOn(command, 'autocomplete').mockRejectedValue(error);
      const interaction = StubInteractionFactory.createAutocomplete();
      const metadata = StubMetadata.create();

      await executor.autocomplete(command, interaction, metadata);

      expect(errorHandler.handle).toHaveBeenCalledOnce();
      const handledError = vi.mocked(errorHandler.handle).mock.calls[0]![0];
      expect(handledError).toBeInstanceOf(CommandAutocompleteError);
    });
  });
});
