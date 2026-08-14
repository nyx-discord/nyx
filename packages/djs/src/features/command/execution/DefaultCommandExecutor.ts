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
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

type CommandExecutorOptions = {
  errorHandler: CommandErrorHandler<DjsInteractionTypes>;
  middleware: MiddlewareList<CommandMiddlewareResolvable<DjsInteractionTypes>>;
};

export class DefaultCommandExecutor implements CommandExecutor<DjsInteractionTypes> {
  protected readonly errorHandler: CommandErrorHandler<DjsInteractionTypes>;

  protected readonly middleware: MiddlewareList<
    CommandMiddlewareResolvable<DjsInteractionTypes>
  >;

  constructor(options: CommandExecutorOptions) {
    this.errorHandler = options.errorHandler;
    this.middleware = options.middleware;
  }

  public static create(options?: {
    injections?: Partial<CommandExecutorOptions>;
  }): CommandExecutor<DjsInteractionTypes> {
    const constructorOptions = options?.injections ?? {};

    ensureKey(
      constructorOptions,
      'errorHandler',
      BasicErrorHandler.createWithFallbackLogger<
        AnyExecutableCommand<DjsInteractionTypes>,
        CommandExecutionArgs<DjsInteractionTypes>
      >((_error, _cmd, [, meta]) =>
        TypedFields.Bot.get(meta, true).getLogger(),
      ),
    );

    ensureKey(
      constructorOptions,
      'middleware',
      CommandMiddlewareList.create<DjsInteractionTypes>(),
    );

    return new this(constructorOptions);
  }

  public async execute(
    command: AnyExecutableCommand<DjsInteractionTypes>,
    interaction: CommandExecutableInteraction<DjsInteractionTypes>,
    metadata: Metadata,
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
    command: ChatExecutableCommand<Nameable, DjsInteractionTypes>,
    interaction: AutocompleteInteraction,
    metadata: Metadata,
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
    command: ChatExecutableCommand<Nameable, DjsInteractionTypes>,
    interaction: ChatInputCommandInteraction,
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
    command: AnyExecutableCommand<DjsInteractionTypes>,
    interaction: ComponentCommandInteraction<DjsInteractionTypes>,
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
    command: ContextMenuCommand<DjsInteractionTypes>,
    interaction: MessageContextMenuCommandInteraction,
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
    command: ContextMenuCommand<DjsInteractionTypes>,
    interaction: UserContextMenuCommandInteraction,
    metadata: Metadata,
  ): Promise<void> {
    await this.executeCommandMethod(
      command,
      interaction,
      metadata,
      command.execute,
    );
  }

  public getErrorHandler(): CommandErrorHandler<DjsInteractionTypes> {
    return this.errorHandler;
  }

  public getMiddleware(): MiddlewareList<
    CommandMiddlewareResolvable<DjsInteractionTypes>
  > {
    return this.middleware;
  }

  protected async executeCommandMethod<
    PassedInteraction extends CommandExecutableInteraction<DjsInteractionTypes>,
  >(
    command: AnyExecutableCommand<DjsInteractionTypes>,
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
      await this.errorHandler.handle(error as object, command, [
        interaction,
        metadata,
      ]);
    }
  }

  protected async checkMiddleware(
    command: AnyExecutableCommand<DjsInteractionTypes>,
    interaction: CommandExecutableInteraction<DjsInteractionTypes>,
    meta: Metadata,
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
    command: AnyExecutableCommand<DjsInteractionTypes>,
    interaction: CommandExecutableInteraction<DjsInteractionTypes>,
    meta: Metadata,
  ): CommandError<DjsInteractionTypes> {
    if (error instanceof CommandMiddlewareError) {
      return error as CommandError<DjsInteractionTypes>;
    }

    return new UncaughtCommandMiddlewareError<DjsInteractionTypes>(
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
    command: AnyExecutableCommand<DjsInteractionTypes>,
    interaction: AutocompleteInteraction,
    meta: Metadata,
  ): CommandError<DjsInteractionTypes> {
    return new CommandAutocompleteError<DjsInteractionTypes>(
      error,
      command,
      interaction,
      meta,
    );
  }
}
