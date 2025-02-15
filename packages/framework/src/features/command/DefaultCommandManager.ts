import type {
  AnyExecutableCommand,
  CommandCustomIdCodec,
  CommandDeployer,
  CommandEventArgs,
  CommandExecutableInteraction,
  CommandExecutor,
  CommandManager,
  CommandRepository,
  CommandResolver,
  CommandSubscriptionsContainer,
  EventBus,
  EventSubscriber,
  NyxBot,
  ReadonlyCommandDeployer,
  TopLevelCommand,
} from '@nyx-discord/core';
import { CommandEventEnum, CommandExecutionMeta } from '@nyx-discord/core';
import type { AutocompleteInteraction, Client, ClientEvents } from 'discord.js';
import { InteractionType } from 'discord.js';

import { BasicEventBus } from '../event/bus/BasicEventBus.js';
import { DefaultCommandCustomIdCodec } from './customId/DefaultCommandCustomIdCodec.js';
import { DefaultCommandDeployer } from './deploy/DefaultCommandDeployer';
import { DefaultCommandAutocompleteSubscriber } from './events/DefaultCommandAutocompleteSubscriber.js';
import { DefaultCommandInteractionSubscriber } from './events/DefaultCommandInteractionSubscriber.js';
import { DefaultCommandSubscriptionsContainer } from './events/DefaultCommandSubscriptionsContainer.js';
import { DefaultCommandExecutor } from './execution/DefaultCommandExecutor.js';
import { DefaultCommandRepository } from './repository/DefaultCommandRepository.js';
import { DefaultCommandResolver } from './resolve/DefaultCommandResolver';

type CommandManagerOptions = {
  subscriptionsContainer: CommandSubscriptionsContainer;
  resolver: CommandResolver;
  repository: CommandRepository;
  executor: CommandExecutor;
  customIdCodec: CommandCustomIdCodec;
  deployer: CommandDeployer;
  eventBus: EventBus<CommandEventArgs>;
  deploy: boolean;
};

export class DefaultCommandManager implements CommandManager {
  public readonly bot: NyxBot;

  protected readonly subscriptionsContainer: CommandSubscriptionsContainer;

  protected readonly resolver: CommandResolver;

  protected readonly repository: CommandRepository;

  protected readonly executor: CommandExecutor;

  protected readonly customIdCodec: CommandCustomIdCodec;

  protected readonly deployer: CommandDeployer;

  protected readonly eventBus: EventBus<CommandEventArgs>;

  protected readonly deployOnStart: boolean;

  constructor(bot: NyxBot, options: CommandManagerOptions) {
    this.bot = bot;
    this.repository = options.repository;
    this.executor = options.executor;
    this.customIdCodec = options.customIdCodec;
    this.resolver = options.resolver;
    this.subscriptionsContainer = options.subscriptionsContainer;
    this.eventBus = options.eventBus;
    this.deployer = options.deployer;
    this.deployOnStart = options.deploy;
  }

  public static create(
    bot: NyxBot,
    client: Client,
    clientBus: EventBus<ClientEvents>,
    deploy: boolean,
    options?: Partial<CommandManagerOptions>,
  ): CommandManager {
    const constructorOptions: Partial<CommandManagerOptions> = options ?? {};

    if (typeof constructorOptions.deploy === 'undefined') {
      constructorOptions.deploy = deploy;
    }

    if (!constructorOptions.eventBus) {
      const busId = Symbol('CommandManagerEventBus');

      constructorOptions.eventBus = BasicEventBus.createAsync<CommandEventArgs>(
        bot,
        busId,
      );
    }

    if (!constructorOptions.repository) {
      constructorOptions.repository = DefaultCommandRepository.create();
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

    if (!constructorOptions.deployer) {
      constructorOptions.deployer = new DefaultCommandDeployer(client);
    }

    return new DefaultCommandManager(
      bot,
      constructorOptions as CommandManagerOptions,
    );
  }

  public async onStart(): Promise<void> {
    await this.subscriptionsContainer.onStart();
    if (this.deployOnStart) {
      await this.deployer.deploy();
    }
  }

  public async onSetup(): Promise<void> {
    await this.subscriptionsContainer.onSetup();
    await this.eventBus.onRegister();
  }

  public async onStop(): Promise<void> {
    await this.subscriptionsContainer.onStop();
    await this.eventBus.onUnregister();
  }

  public async addCommands(...commands: TopLevelCommand[]): Promise<this> {
    for (const command of commands) {
      this.repository.addCommand(command);
    }

    try {
      await this.deployer.deployCommands(...commands);
    } catch (error) {
      for (const command of commands) {
        this.repository.removeCommand(command);
      }

      throw error;
    }

    for (const command of commands) {
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandAdd, [command]),
      ).catch((error) => {
        const id = command.getId();

        this.bot
          .getLogger()
          .error(
            `'Uncaught bus error while emitting command add '${id}'.`,
            error,
          );
      });
    }

    return this;
  }

  public async removeCommands(...commands: TopLevelCommand[]): Promise<this> {
    for (const command of commands) {
      this.repository.removeCommand(command);
    }

    try {
      await this.deployer.removeCommands(...commands);
    } catch (error) {
      for (const command of commands) {
        this.repository.addCommand(command);
      }

      throw error;
    }

    for (const command of commands) {
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandRemove, [command]),
      ).catch((error) => {
        const id = command.getId();

        this.bot
          .getLogger()
          .error(
            `'Uncaught bus error while emitting command remove '${id}'.`,
            error,
          );
      });
    }

    return this;
  }

  public async editCommands(...commands: TopLevelCommand[]): Promise<this> {
    for (const command of commands) {
      this.repository.removeCommand(command);
      this.repository.addCommand(command);
    }

    await this.deployer.editCommands(...commands);

    return this;
  }

  public async setCommands(...commands: TopLevelCommand[]): Promise<this> {
    for (const repoCommand of this.repository.values()) {
      this.repository.removeCommand(repoCommand);
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandRemove, [repoCommand]),
      ).catch((error) => {
        const id = repoCommand.getId();

        this.bot
          .getLogger()
          .error(
            `'Uncaught bus error while emitting command remove due to set '${id}'.`,
            error,
          );
      });
    }

    for (const setCommand of commands) {
      this.repository.addCommand(setCommand);
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandAdd, [setCommand]),
      ).catch((error) => {
        const id = setCommand.getId();

        this.bot
          .getLogger()
          .error(
            `'Uncaught bus error while emitting command add due to set '${id}'.`,
            error,
          );
      });
    }

    await this.deployer.setCommands(...commands);
    return this;
  }

  public async autocomplete(
    interaction: AutocompleteInteraction,
    meta?: CommandExecutionMeta,
  ): Promise<boolean> {
    const command = this.resolver.resolveFromAutocompleteInteraction(
      interaction,
      this.repository,
    );
    if (!command) return false;

    const metadata =
      meta
      ?? CommandExecutionMeta.fromCommandAutocomplete(
        command,
        interaction,
        this.bot,
      );

    try {
      if (!command.isSubCommand() && !command.isStandalone()) return false;
      await this.executor.autocomplete(command, interaction, metadata);
    } catch (error) {
      const executionId = String(metadata.getId());

      this.bot
        .getLogger()
        .error(
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

      this.bot
        .getLogger()
        .error(
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
    let command: AnyExecutableCommand | null;

    if (interaction.type === InteractionType.ApplicationCommand) {
      command = this.resolver.resolveFromCommandInteraction(
        interaction,
        this.repository,
      );
    } else {
      const { customId } = interaction;

      const names = this.customIdCodec.deserializeToNameTree(customId);
      if (!names) return false;

      const found = this.repository.locateByNameTree(...names);
      if (!found || found.isParent() || found.isSubCommandGroup()) {
        return false;
      }

      command = found;
    }

    if (!command) return false;

    const metadata =
      meta
      ?? CommandExecutionMeta.fromCommandCall(command, interaction, this.bot);

    try {
      await this.executor.execute(command, interaction, metadata);
    } catch (error) {
      const executionId = String(metadata.getId());

      this.bot
        .getLogger()
        .error(
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

      this.bot
        .getLogger()
        .error(
          `Uncaught event bus error while emitting command run '${executionId}'.`,
          error,
        );
    });

    return true;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<CommandEventArgs, keyof CommandEventArgs>[]
  ): Promise<this> {
    await this.eventBus.subscribe(...subscribers);
    return this;
  }

  public async deploy(): Promise<void> {
    await this.deployer.deploy();
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

  public getDeployer(): ReadonlyCommandDeployer {
    return this.deployer;
  }
}
