/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type {
  AnyExecutableCommand,
  ChatExecutableCommand,
  CommandError,
  CommandErrorHandler,
  CommandExecutableInteraction,
  CommandExecutionArgs,
  CommandExecutionMeta,
  CommandExecutor,
  CommandMiddleware,
  ComponentCommandInteraction,
  ContextMenuCommand,
  MiddlewareList,
} from '@nyx-discord/core';
import {
  CommandAutocompleteError,
  CommandAutocompleteRespondError,
  CommandMiddlewareError,
  UncaughtCommandMiddlewareError,
} from '@nyx-discord/core';
import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { CommandMiddlewareList } from '../middleware/CommandMiddlewareList';

export class DefaultCommandExecutor implements CommandExecutor {
  protected readonly errorHandler: CommandErrorHandler;

  protected readonly middleware: MiddlewareList<CommandMiddleware>;

  constructor(
    errorHandler: CommandErrorHandler,
    middleware: MiddlewareList<CommandMiddleware>,
  ) {
    this.errorHandler = errorHandler;
    this.middleware = middleware;
  }

  public static create(): CommandExecutor {
    return new DefaultCommandExecutor(
      BasicErrorHandler.create<AnyExecutableCommand, CommandExecutionArgs>(),
      CommandMiddlewareList.create(),
    );
  }

  public async execute(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    metadata: CommandExecutionMeta,
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
    command: ChatExecutableCommand<unknown>,
    interaction: AutocompleteInteraction,
    metadata: CommandExecutionMeta,
  ): Promise<void> {
    const bot = metadata.getBot();

    try {
      await command.autocomplete(interaction, metadata);
    } catch (error) {
      const wrappedError = this.wrapAutocompleteError(
        error as Error,
        command,
        interaction,
        metadata,
      );
      await this.errorHandler.handle(
        wrappedError,
        command,
        [interaction, metadata],
        bot,
      );
      return;
    }
  }

  public async executeChatInput(
    command: ChatExecutableCommand<unknown>,
    interaction: ChatInputCommandInteraction,
    metadata: CommandExecutionMeta,
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
    metadata: CommandExecutionMeta,
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
    metadata: CommandExecutionMeta,
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
    metadata: CommandExecutionMeta,
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

  public getMiddleware(): MiddlewareList<CommandMiddleware> {
    return this.middleware;
  }

  protected async executeCommandMethod<
    PassedInteraction extends CommandExecutableInteraction,
  >(
    command: AnyExecutableCommand,
    interaction: PassedInteraction,
    metadata: CommandExecutionMeta,
    method: (
      interact: PassedInteraction,
      meta: CommandExecutionMeta,
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
      const bot = metadata.getBot();
      await this.errorHandler.handle(
        error as object,
        command,
        [interaction, metadata],
        bot,
      );
    }
  }

  protected async checkMiddleware(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: CommandExecutionMeta,
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

      const bot = meta.getBot();
      await this.errorHandler.handle(
        wrappedError,
        command,
        [interaction, meta],
        bot,
      );

      return false;
    }
    return result;
  }

  protected wrapMiddlewareError(
    error: Error,
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: CommandExecutionMeta,
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

  protected wrapAutocompleteError(
    error: Error,
    command: AnyExecutableCommand,
    interaction: AutocompleteInteraction,
    meta: CommandExecutionMeta,
  ): CommandError {
    return new CommandAutocompleteError(error, command, interaction, meta);
  }

  protected wrapAutocompleteRespondError(
    error: Error,
    command: AnyExecutableCommand,
    interaction: AutocompleteInteraction,
    meta: CommandExecutionMeta,
  ): CommandError {
    return new CommandAutocompleteRespondError(
      error,
      command,
      interaction,
      meta,
    );
  }

  protected filterChoices(
    choices: ApplicationCommandOptionChoiceData[],
    interaction: AutocompleteInteraction,
  ): ApplicationCommandOptionChoiceData[] {
    const focused = interaction.options.getFocused();

    const filteredChoices = focused.length
      ? choices.filter((option) =>
          String(option.value).toLowerCase().startsWith(focused.toLowerCase()),
        )
      : (choices as ApplicationCommandOptionChoiceData[]);

    // Add the currently typed option as a first choice, for user convenience
    if (
      focused.length
      && filteredChoices.length
      && filteredChoices[0].name !== focused
      && !filteredChoices.find(
        (option) => option.name === focused || option.value === focused,
      )
    ) {
      filteredChoices.unshift({ name: focused, value: focused });
    }

    return filteredChoices.slice(0, 25);
  }
}