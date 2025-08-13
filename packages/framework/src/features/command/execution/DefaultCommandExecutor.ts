import type {
  AnyExecutableCommand,
  ChatExecutableCommand,
  CommandError,
  CommandErrorHandler,
  CommandExecutableInteraction,
  CommandExecutionArgs,
  CommandExecutor,
  CommandMiddlewareResolvable,
  ComponentCommandInteraction,
  ContextMenuCommand,
  MetaCollection,
  MiddlewareList,
  Nameable,
} from '@nyx-discord/core';
import {
  CommandAutocompleteError,
  CommandMiddlewareError,
  TypedFields,
  UncaughtCommandMiddlewareError,
} from '@nyx-discord/core';
import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { CommandMiddlewareList } from '../middleware/CommandMiddlewareList.js';

export class DefaultCommandExecutor implements CommandExecutor {
  protected readonly errorHandler: CommandErrorHandler;

  protected readonly middleware: MiddlewareList<CommandMiddlewareResolvable>;

  constructor(
    errorHandler: CommandErrorHandler,
    middleware: MiddlewareList<CommandMiddlewareResolvable>,
  ) {
    this.errorHandler = errorHandler;
    this.middleware = middleware;
  }

  public static create(): CommandExecutor {
    return new DefaultCommandExecutor(
      BasicErrorHandler.createWithFallbackLogger<
        AnyExecutableCommand,
        CommandExecutionArgs
      >((_error, _cmd, [, meta]) =>
        TypedFields.Bot.get(meta, true).getLogger(),
      ),
      CommandMiddlewareList.create(),
    );
  }

  public async execute(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    metadata: MetaCollection,
  ): Promise<boolean> {
    if (
      interaction.isChatInputCommand()
      && (command.isSubCommand() || command.isStandalone())
    ) {
      await this.executeChatInput(command, interaction, metadata);
      return true;
    }

    if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
      await this.executeComponent(command, interaction, metadata);
      return true;
    }

    if (interaction.isUserContextMenuCommand()) {
      if (!command.isContextMenu()) return false;

      await this.executeUser(command, interaction, metadata);
      return true;
    }

    if (interaction.isMessageContextMenuCommand()) {
      if (!command.isContextMenu()) return false;

      await this.executeMessage(command, interaction, metadata);
      return true;
    }

    return false;
  }

  public async autocomplete(
    command: ChatExecutableCommand<Nameable>,
    interaction: AutocompleteInteraction,
    metadata: MetaCollection,
  ): Promise<void> {
    try {
      await command.autocomplete(interaction, metadata);
    } catch (error) {
      const wrappedError = this.wrapAutocompleteError(
        error as Error,
        command,
        interaction,
        metadata,
      );
      await this.errorHandler.handle(wrappedError, command, [
        interaction,
        metadata,
      ]);
      return;
    }
  }

  public async executeChatInput(
    command: ChatExecutableCommand<Nameable>,
    interaction: ChatInputCommandInteraction,
    metadata: MetaCollection,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public async executeComponent(
    command: AnyExecutableCommand,
    interaction: ComponentCommandInteraction,
    metadata: MetaCollection,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.handleInteraction,
    );
  }

  public async executeMessage(
    command: ContextMenuCommand,
    interaction: MessageContextMenuCommandInteraction,
    metadata: MetaCollection,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public async executeUser(
    command: ContextMenuCommand,
    interaction: UserContextMenuCommandInteraction,
    metadata: MetaCollection,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public getErrorHandler(): CommandErrorHandler {
    return this.errorHandler;
  }

  public getMiddleware(): MiddlewareList<CommandMiddlewareResolvable> {
    return this.middleware;
  }

  protected async executeCommandMethod<
    PassedInteraction extends CommandExecutableInteraction,
  >(
    command: AnyExecutableCommand,
    interaction: PassedInteraction,
    metadata: MetaCollection,
    method: (
      interact: PassedInteraction,
      meta: MetaCollection,
    ) => Awaitable<void>,
  ): Promise<void> {
    const middlewareResult = await this.checkMiddleware(
      command,
      interaction,
      metadata,
    );
    if (!middlewareResult) return;

    try {
      const boundMethod = method.bind(command);
      await boundMethod(interaction, metadata);
    } catch (error) {
      await this.errorHandler.handle(error as object, command, [
        interaction,
        metadata,
      ]);
    }
  }

  protected async checkMiddleware(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: MetaCollection,
  ): Promise<boolean> {
    let result;
    try {
      result = await this.middleware.check(command, interaction, meta);
    } catch (error) {
      const wrappedError = this.wrapMiddlewareError(
        error as Error,
        command,
        interaction,
        meta,
      );

      await this.errorHandler.handle(wrappedError, command, [
        interaction,
        meta,
      ]);

      return false;
    }
    return result;
  }

  /**
   * Wraps a middleware error in an {@link UncaughtCommandMiddlewareError} if
   * it isn't an {@link CommandMiddlewareError}.
   */
  protected wrapMiddlewareError(
    error: Error,
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: MetaCollection,
  ): CommandError {
    if (error instanceof CommandMiddlewareError) {
      return error;
    }

    return new UncaughtCommandMiddlewareError(
      error,
      this.middleware,
      command,
      interaction,
      meta,
    );
  }

  /** Wraps a middleware autocomplete error in a {@link CommandAutocompleteError}. */
  protected wrapAutocompleteError(
    error: Error,
    command: AnyExecutableCommand,
    interaction: AutocompleteInteraction,
    meta: MetaCollection,
  ): CommandError {
    return new CommandAutocompleteError(error, command, interaction, meta);
  }
}
