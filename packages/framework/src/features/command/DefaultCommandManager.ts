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
  CommandCustomIdCodec,
  CommandData,
  CommandEventArgs,
  CommandExecutableInteraction,
  CommandExecutor,
  CommandManager,
  CommandRepository,
  CommandResolver,
  CommandSubscriptionsContainer,
  EventBus,
  EventSubscriber,
  ExecutableCommand,
  NyxBot,
  ParentCommand,
  TopLevelCommand,
} from '@nyx-discord/core';
import { CommandEventEnum, CommandExecutionMeta } from '@nyx-discord/core';
import type { AutocompleteInteraction, Client, ClientEvents } from 'discord.js';
import { InteractionType } from 'discord.js';

import { BasicEventBus } from '../event/bus/BasicEventBus.js';
import { DefaultCommandCustomIdCodec } from './customId/DefaultCommandCustomIdCodec.js';
import { DefaultCommandAutocompleteSubscriber } from './events/DefaultCommandAutocompleteSubscriber.js';
import { DefaultCommandInteractionSubscriber } from './events/DefaultCommandInteractionSubscriber.js';
import { DefaultCommandSubscriptionsContainer } from './events/DefaultCommandSubscriptionsContainer.js';
import { DefaultCommandExecutor } from './executor/DefaultCommandExecutor.js';
import { DefaultCommandRepository } from './repository/DefaultCommandRepository.js';
import { DefaultCommandResolver } from './resolver/DefaultCommandResolver.js';

type CommandManagerOptions = {
  subscriptionsContainer: CommandSubscriptionsContainer;
  resolver: CommandResolver;
  repository: CommandRepository;
  executor: CommandExecutor;
  customIdCodec: CommandCustomIdCodec;
  eventBus: EventBus<CommandEventArgs>;
};

export class DefaultCommandManager implements CommandManager {
  public readonly bot: NyxBot;

  protected readonly subscriptionsContainer: CommandSubscriptionsContainer;

  protected readonly resolver: CommandResolver;

  protected readonly repository: CommandRepository;

  protected readonly executor: CommandExecutor;

  protected readonly customIdCodec: CommandCustomIdCodec;

  protected readonly eventBus: EventBus<CommandEventArgs>;

  constructor(bot: NyxBot, options: CommandManagerOptions) {
    this.bot = bot;
    this.repository = options.repository;
    this.executor = options.executor;
    this.customIdCodec = options.customIdCodec;
    this.resolver = options.resolver;
    this.subscriptionsContainer = options.subscriptionsContainer;
    this.eventBus = options.eventBus;
  }

  public static create(
    bot: NyxBot,
    client: Client,
    clientBus: EventBus<ClientEvents>,
    refreshCommands: boolean,
    options?: Partial<CommandManagerOptions>,
  ): CommandManager {
    const constructorOptions: Partial<CommandManagerOptions> = options ?? {};

    if (!constructorOptions.eventBus) {
      const busId = Symbol('CommandManagerEventBus');

      constructorOptions.eventBus = BasicEventBus.createAsync<CommandEventArgs>(
        bot,
        busId,
      );
    }

    if (!constructorOptions.repository) {
      constructorOptions.repository = DefaultCommandRepository.create(
        client,
        refreshCommands,
      );
    }

    if (!constructorOptions.executor) {
      constructorOptions.executor = DefaultCommandExecutor.create();
    }

    if (!constructorOptions.customIdCodec) {
      constructorOptions.customIdCodec = DefaultCommandCustomIdCodec.create();
    }

    if (!constructorOptions.resolver) {
      constructorOptions.resolver = DefaultCommandResolver.create();
    }

    if (!constructorOptions.subscriptionsContainer) {
      constructorOptions.subscriptionsContainer =
        DefaultCommandSubscriptionsContainer.create(
          clientBus,
          new DefaultCommandInteractionSubscriber(),
          new DefaultCommandAutocompleteSubscriber(),
        );
    }

    return new DefaultCommandManager(
      bot,
      constructorOptions as CommandManagerOptions,
    );
  }

  public async onStart(): Promise<void> {
    await this.subscriptionsContainer.onStart();
    await this.repository.onStart();
  }

  public async onSetup(): Promise<void> {
    await this.repository.onSetup();
    await this.subscriptionsContainer.onSetup();
    await this.eventBus.onRegister();
  }

  public async onStop(): Promise<void> {
    await this.repository.onStop();
    await this.subscriptionsContainer.onStop();
    await this.eventBus.onUnregister();
  }

  public async addCommand(command: TopLevelCommand): Promise<this> {
    await this.repository.addCommand(command);

    Promise.resolve(
      this.eventBus.emit(CommandEventEnum.CommandAdd, [command]),
    ).catch((error) => {
      const id = command.getId();

      this.bot.logger.error(
        `'Uncaught bus error while emitting command add '${id}'.`,
        error,
      );
    });

    return this;
  }

  public async removeCommand(command: TopLevelCommand): Promise<this> {
    await this.repository.removeCommand(command);

    Promise.resolve(
      this.eventBus.emit(CommandEventEnum.CommandRemove, [command]),
    ).catch((error) => {
      const id = command.getId();

      this.bot.logger.error(
        `'Uncaught bus error while emitting command remove '${id}'.`,
        error,
      );
    });

    return this;
  }

  public async updateParentCommand(command: ParentCommand): Promise<this> {
    await this.repository.updateParentCommand(command);

    return this;
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
    meta?: CommandExecutionMeta,
  ): Promise<boolean> {
    const resolvedCommandData =
      this.resolver.resolveFromAutocompleteInteraction(interaction);
    if (!resolvedCommandData) return false;

    const command = this.repository.locateByData(resolvedCommandData);
    if (!command) return false;

    const metadata =
      meta
      ?? CommandExecutionMeta.fromCommandAutocomplete(
        command,
        interaction,
        this.bot,
      );

    try {
      await this.executor.autocomplete(command, interaction, metadata);
    } catch (error) {
      const executionId = String(metadata.getId());

      this.bot.logger.error(
        `Uncaught executor error while autocompleting command '${executionId}'.`,
        error,
      );
    }

    Promise.resolve(
      this.eventBus.emit(CommandEventEnum.CommandAutocomplete, [
        command,
        interaction,
        metadata,
      ]),
    ).catch((error) => {
      const executionId = String(metadata.getId());

      this.bot.logger.error(
        `Uncaught event bus error while emitting command autocomplete '${executionId}'.`,
        error,
      );
    });

    return interaction.responded;
  }

  public async execute(
    interaction: CommandExecutableInteraction,
    meta?: CommandExecutionMeta,
  ): Promise<boolean> {
    let command: ExecutableCommand<CommandData> | null;

    if (interaction.type === InteractionType.ApplicationCommand) {
      const data = this.resolver.resolveFromCommandInteraction(interaction);
      if (!data) return false;
      command = this.repository.locateByData(data);
    } else {
      const { customId } = interaction;

      const commandData = this.customIdCodec.deserializeToData(customId);
      if (!commandData) return false;

      const foundCommand = this.repository.locateByData(commandData);
      if (!foundCommand || !foundCommand.isExecutable()) return false;

      command = foundCommand;
    }

    if (!command) return false;

    const metadata =
      meta
      ?? CommandExecutionMeta.fromCommandCall(command, interaction, this.bot);

    try {
      await this.executor.execute(command, interaction, metadata);
    } catch (error) {
      const executionId = String(metadata.getId());

      this.bot.logger.error(
        `Uncaught executor error while executing command '${executionId}'.`,
        error,
      );

      return interaction.replied;
    }

    Promise.resolve(
      this.eventBus.emit(CommandEventEnum.CommandRun, [
        command,
        interaction,
        metadata,
      ]),
    ).catch((error) => {
      const executionId = String(metadata.getId());

      this.bot.logger.error(
        `Uncaught event bus error while emitting command run '${executionId}'.`,
        error,
      );
    });

    return true;
  }

  public async subscribe(
    subscriber: EventSubscriber<CommandEventArgs, keyof CommandEventArgs>,
  ): Promise<void> {
    await this.eventBus.subscribe(subscriber);
  }

  public getExecutor(): CommandExecutor {
    return this.executor;
  }

  public getCustomIdCodec(): CommandCustomIdCodec {
    return this.customIdCodec;
  }

  public getResolver(): CommandResolver {
    return this.resolver;
  }

  public getRepository(): CommandRepository {
    return this.repository;
  }

  public getSubscriptions(): CommandSubscriptionsContainer {
    return this.subscriptionsContainer;
  }

  public getEventBus(): EventBus<CommandEventArgs> {
    return this.eventBus;
  }
}
