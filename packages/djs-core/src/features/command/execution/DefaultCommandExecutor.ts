import { BasicErrorHandler } from '@nyx-discord/base';
import { CommandMiddlewareList } from '@nyx-discord/base';
import { ensureKey } from '@nyx-discord/base';
import type {
  AnyExecutableCommand,
  Awaitable,
  ChatExecutableCommand,
  CommandError,
  CommandErrorHandler,
  CommandExecutableInteraction,
  CommandExecutionArgs,
  CommandExecutor,
  CommandMiddlewareResolvable,
  ComponentCommandInteraction,
  ContextMenuCommand,
  Metadata,
  MiddlewareList,
  Nameable,
} from '@nyx-discord/types';
import {
  CommandAutocompleteError,
  CommandMiddlewareError,
  TypedFields,
  UncaughtCommandMiddlewareError,
} from '@nyx-discord/types';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
} from 'discord-api-types/v10';
import { ApplicationCommandType, InteractionType } from 'discord-api-types/v10';
import type { ToEventProps } from '@discordjs/core';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

type CommandExecutorOptions = {
  errorHandler: CommandErrorHandler<CoreInteractionTypes>;
  middleware: MiddlewareList<CommandMiddlewareResolvable<CoreInteractionTypes>>;
};

export class DefaultCommandExecutor implements CommandExecutor<CoreInteractionTypes> {
  protected readonly errorHandler: CommandErrorHandler<CoreInteractionTypes>;

  protected readonly middleware: MiddlewareList<
    CommandMiddlewareResolvable<CoreInteractionTypes>
  >;

  constructor(options: CommandExecutorOptions) {
    this.errorHandler = options.errorHandler;
    this.middleware = options.middleware;
  }

  public static create(options?: {
    injections?: Partial<CommandExecutorOptions>;
  }): CommandExecutor<CoreInteractionTypes> {
    const constructorOptions = options?.injections ?? {};

    ensureKey(
      constructorOptions,
      'errorHandler',
      BasicErrorHandler.createWithFallbackLogger<
        AnyExecutableCommand<CoreInteractionTypes>,
        CommandExecutionArgs<CoreInteractionTypes>
      >((_error, _cmd, [, meta]) =>
        TypedFields.Bot.get(meta, true).getLogger(),
      ),
    );

    ensureKey(
      constructorOptions,
      'middleware',
      CommandMiddlewareList.create<CoreInteractionTypes>(),
    );

    return new this(constructorOptions);
  }

  public async execute(
    command: AnyExecutableCommand<CoreInteractionTypes>,
    interaction: CommandExecutableInteraction<CoreInteractionTypes>,
    metadata: Metadata,
  ): Promise<boolean> {
    const data = interaction.data;
    if (data.type === InteractionType.ApplicationCommand) {
      const commandData = data.data;

      if (commandData.type === ApplicationCommandType.ChatInput) {
        if (command.isSubCommand() || command.isStandalone()) {
          await this.executeChatInput(
            command,
            interaction as ToEventProps<APIChatInputApplicationCommandInteraction>,
            metadata,
          );
          return true;
        }
        return false;
      }

      if (commandData.type === ApplicationCommandType.User) {
        if (!command.isContextMenu()) return false;
        await this.executeUser(
          command,
          interaction as ToEventProps<APIUserApplicationCommandInteraction>,
          metadata,
        );
        return true;
      }

      if (commandData.type === ApplicationCommandType.Message) {
        if (!command.isContextMenu()) return false;
        await this.executeMessage(
          command,
          interaction as ToEventProps<APIMessageApplicationCommandInteraction>,
          metadata,
        );
        return true;
      }

      return false;
    }

    if (
      data.type === InteractionType.MessageComponent
      || data.type === InteractionType.ModalSubmit
    ) {
      await this.executeComponent(
        command,
        interaction as ComponentCommandInteraction<CoreInteractionTypes>,
        metadata,
      );
      return true;
    }

    return false;
  }

  public async autocomplete(
    command: ChatExecutableCommand<Nameable, CoreInteractionTypes>,
    interaction: ToEventProps<APIApplicationCommandAutocompleteInteraction>,
    metadata: Metadata,
  ): Promise<void> {
    try {
      await command.autocomplete(interaction, metadata);
    } catch (error) {
      const resolvedError =
        error instanceof Error ? error : new Error(String(error));
      const wrappedError = this.wrapAutocompleteError(
        resolvedError,
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
    command: ChatExecutableCommand<Nameable, CoreInteractionTypes>,
    interaction: ToEventProps<APIChatInputApplicationCommandInteraction>,
    metadata: Metadata,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public async executeComponent(
    command: AnyExecutableCommand<CoreInteractionTypes>,
    interaction: ComponentCommandInteraction<CoreInteractionTypes>,
    metadata: Metadata,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.handleInteraction,
    );
  }

  public async executeMessage(
    command: ContextMenuCommand<CoreInteractionTypes>,
    interaction: ToEventProps<APIMessageApplicationCommandInteraction>,
    metadata: Metadata,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public async executeUser(
    command: ContextMenuCommand<CoreInteractionTypes>,
    interaction: ToEventProps<APIUserApplicationCommandInteraction>,
    metadata: Metadata,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public getErrorHandler(): CommandErrorHandler<CoreInteractionTypes> {
    return this.errorHandler;
  }

  public getMiddleware(): MiddlewareList<
    CommandMiddlewareResolvable<CoreInteractionTypes>
  > {
    return this.middleware;
  }

  protected async executeCommandMethod<
    PassedInteraction extends
      CommandExecutableInteraction<CoreInteractionTypes>,
  >(
    command: AnyExecutableCommand<CoreInteractionTypes>,
    interaction: PassedInteraction,
    metadata: Metadata,
    method: (interact: PassedInteraction, meta: Metadata) => Awaitable<void>,
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
      const resolvedError =
        error instanceof Error ? error : new Error(String(error));
      await this.errorHandler.handle(resolvedError, command, [
        interaction,
        metadata,
      ]);
    }
  }

  protected async checkMiddleware(
    command: AnyExecutableCommand<CoreInteractionTypes>,
    interaction: CommandExecutableInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    let result;
    try {
      result = await this.middleware.check(command, interaction, meta);
    } catch (error) {
      const resolvedError =
        error instanceof Error ? error : new Error(String(error));
      const wrappedError = this.wrapMiddlewareError(
        resolvedError,
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

  /** Wraps a middleware error in an {@link UncaughtCommandMiddlewareError} if it isn't a {@link CommandMiddlewareError}. */
  protected wrapMiddlewareError(
    error: Error,
    command: AnyExecutableCommand<CoreInteractionTypes>,
    interaction: CommandExecutableInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): CommandError<CoreInteractionTypes> {
    if (error instanceof CommandMiddlewareError) {
      return error as CommandError<CoreInteractionTypes>;
    }

    return new UncaughtCommandMiddlewareError<CoreInteractionTypes>(
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
    command: AnyExecutableCommand<CoreInteractionTypes>,
    interaction: ToEventProps<APIApplicationCommandAutocompleteInteraction>,
    meta: Metadata,
  ): CommandError<CoreInteractionTypes> {
    return new CommandAutocompleteError<CoreInteractionTypes>(
      error,
      command,
      interaction,
      meta,
    );
  }
}
