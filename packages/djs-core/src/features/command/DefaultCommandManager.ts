import type {
  AnyExecutableCommand,
  ApplicationCommandInteraction,
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
  Identifier,
  Metadata,
  MetadataFactory,
  NyxBot,
  ReadonlyCommandDeployer,
  TopLevelCommand,
} from '@nyx-discord/types';
import {
  CommandEventEnum,
  IllegalStateError,
  TypedFields,
} from '@nyx-discord/types';
import { BasicEventBus } from '@nyx-discord/base';
import { DefaultCommandCustomIdCodec } from '@nyx-discord/base';
import { DefaultCommandRepository } from '@nyx-discord/base';
import { DefaultMetadataFactory } from '@nyx-discord/base';
import { ensureKey } from '@nyx-discord/base';
import type { MappedEvents, ToEventProps } from '@discordjs/core';
import type {
  APIApplicationCommand,
  APIApplicationCommandAutocompleteInteraction,
} from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import type { CoreNyxClient } from '../../client/CoreNyxClient.js';
import type { CoreInteractionTypes } from '../../types/CoreInteractionTypes.js';
import { DefaultCommandDeployer } from './deploy/DefaultCommandDeployer.js';
import { DefaultCommandAutocompleteSubscriber } from './events/DefaultCommandAutocompleteSubscriber.js';
import { DefaultCommandInteractionSubscriber } from './events/DefaultCommandInteractionSubscriber.js';
import { DefaultCommandSubscriptionsContainer } from './events/DefaultCommandSubscriptionsContainer.js';
import { DefaultCommandExecutor } from './execution/DefaultCommandExecutor.js';
import { DefaultCommandResolver } from './resolve/DefaultCommandResolver.js';

type CommandManagerOptions = {
  subscriptionsContainer: CommandSubscriptionsContainer<MappedEvents>;
  resolver: CommandResolver<CoreInteractionTypes>;
  repository: CommandRepository<CoreInteractionTypes>;
  executor: CommandExecutor<CoreInteractionTypes>;
  customIdCodec: CommandCustomIdCodec;
  deployer: CommandDeployer<CoreInteractionTypes, APIApplicationCommand>;
  eventBus: EventBus<CommandEventArgs<CoreInteractionTypes>>;
  metaFactory: MetadataFactory;
};

export class DefaultCommandManager implements CommandManager<
  CoreInteractionTypes,
  MappedEvents,
  APIApplicationCommand
> {
  protected subscriptionsContainer: CommandSubscriptionsContainer<MappedEvents>;

  protected resolver: CommandResolver<CoreInteractionTypes>;

  protected repository: CommandRepository<CoreInteractionTypes>;

  protected executor: CommandExecutor<CoreInteractionTypes>;

  protected customIdCodec: CommandCustomIdCodec;

  protected deployer: CommandDeployer<
    CoreInteractionTypes,
    APIApplicationCommand
  >;

  protected eventBus: EventBus<CommandEventArgs<CoreInteractionTypes>>;

  protected metaFactory: MetadataFactory;

  constructor(options: CommandManagerOptions) {
    this.repository = options.repository;
    this.executor = options.executor;
    this.customIdCodec = options.customIdCodec;
    this.resolver = options.resolver;
    this.subscriptionsContainer = options.subscriptionsContainer;
    this.eventBus = options.eventBus;
    this.deployer = options.deployer;
    this.metaFactory = options.metaFactory;
  }

  public static create(options: {
    bot: NyxBot;
    client: CoreNyxClient;
    clientBus: EventBus<MappedEvents>;
    injections?: Partial<CommandManagerOptions>;
  }): CommandManager<
    CoreInteractionTypes,
    MappedEvents,
    APIApplicationCommand
  > {
    const constructorOptions: Partial<CommandManagerOptions> =
      options.injections ?? {};
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

    ensureKey(
      constructorOptions,
      'eventBus',
      BasicEventBus.createAsync<CommandEventArgs<CoreInteractionTypes>>(
        metaFactory,
      ),
    );
    ensureKey(
      constructorOptions,
      'repository',
      DefaultCommandRepository.create<CoreInteractionTypes>(),
    );
    ensureKey(constructorOptions, 'executor', DefaultCommandExecutor.create());
    ensureKey(
      constructorOptions,
      'customIdCodec',
      DefaultCommandCustomIdCodec.create(),
    );
    ensureKey(constructorOptions, 'resolver', DefaultCommandResolver.create());
    ensureKey(
      constructorOptions,
      'subscriptionsContainer',
      DefaultCommandSubscriptionsContainer.create(
        options.clientBus,
        new DefaultCommandInteractionSubscriber(),
        new DefaultCommandAutocompleteSubscriber(),
      ),
    );
    ensureKey(
      constructorOptions,
      'deployer',
      DefaultCommandDeployer.create(
        options.client.getApi(),
        options.client.getApplicationId(),
      ),
    );
    ensureKey(constructorOptions, 'metaFactory', metaFactory);

    return new this(constructorOptions);
  }

  public async onStart(): Promise<void> {
    await this.subscriptionsContainer.subscribe();
  }

  public async onStop(): Promise<void> {
    await this.subscriptionsContainer.unsubscribe();
  }

  public async addCommands(
    ...commands: TopLevelCommand<CoreInteractionTypes>[]
  ): Promise<this> {
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
      ).catch((_error) => {});
    }

    return this;
  }

  public async removeCommands(
    ...commands: TopLevelCommand<CoreInteractionTypes>[]
  ): Promise<this> {
    for (const command of commands) {
      this.repository.removeCommand(command);
    }

    try {
      await this.deployer.removeCommands(...commands);
    } catch (error) {
      for (const command of commands) {
        if (this.repository.isCommandInstance(command)) continue;
        this.repository.addCommand(command);
      }

      throw error;
    }

    for (const command of commands) {
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandRemove, [command]),
      ).catch((_error) => {});
    }

    return this;
  }

  public async editCommands(
    ...commands: TopLevelCommand<CoreInteractionTypes>[]
  ): Promise<this> {
    for (const command of commands) {
      this.repository.removeCommand(command);
      this.repository.addCommand(command);
    }

    await this.deployer.editCommands(...commands);

    return this;
  }

  public async setCommands(
    ...commands: TopLevelCommand<CoreInteractionTypes>[]
  ): Promise<this> {
    for (const repoCommand of this.repository.values()) {
      this.repository.removeCommand(repoCommand);
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandRemove, [repoCommand]),
      ).catch((_error) => {});
    }

    for (const setCommand of commands) {
      this.repository.addCommand(setCommand);
      Promise.resolve(
        this.eventBus.emit(CommandEventEnum.CommandAdd, [setCommand]),
      ).catch((_error) => {});
    }

    await this.deployer.setCommands(...commands);
    return this;
  }

  public async autocomplete(
    interaction: ToEventProps<APIApplicationCommandAutocompleteInteraction>,
    meta?: Metadata,
  ): Promise<boolean> {
    const command = this.resolver.resolveFromAutocompleteInteraction(
      interaction,
      this.repository,
    );
    if (!command) return false;

    const focused = interaction.data.data.options?.find(
      (option) => 'focused' in option && option.focused,
    );
    const extraData: { name: string; value: string }[] = [];
    if (focused) {
      extraData.push({ name: 'Option', value: focused.name });
      if ('value' in focused) {
        extraData.push({ name: 'Value', value: `${focused.value}` });
      }
    }

    const { metadata, executionId } = this.createOrPopulateMeta({
      meta,
      command,
      customIdExtra: null,
      interaction,
      extraData,
    });

    try {
      if (!command.isSubCommand() && !command.isStandalone()) return false;
      await this.executor.autocomplete(command, interaction, metadata);
    } catch (error) {
      const wrapped = new Error(
        `Uncaught executor error while autocompleting command '${String(executionId)}'.`,
        { cause: error },
      );
      await this.executor
        .getErrorHandler()
        .handle(wrapped, command, [interaction, metadata]);
    }

    Promise.resolve(
      this.eventBus.emit(CommandEventEnum.CommandAutocomplete, [
        command,
        interaction,
        metadata,
      ]),
    ).catch((_error) => {});

    return true;
  }

  public async execute(
    interaction: CommandExecutableInteraction<CoreInteractionTypes>,
    meta?: Metadata,
  ): Promise<boolean> {
    let command: AnyExecutableCommand<CoreInteractionTypes> | null;
    let customIdExtra: string | null = null;

    const data = interaction.data;
    if (data.type === InteractionType.ApplicationCommand) {
      command = this.resolver.resolveFromCommandInteraction(
        interaction as ApplicationCommandInteraction<CoreInteractionTypes>,
        this.repository,
      );
    } else {
      const { custom_id: customId } = data.data;

      const decoded = this.customIdCodec.deserialize(customId);
      if (!decoded) return false;

      const found = this.resolver.resolveFromCustomIdData(
        decoded,
        this.repository,
      );
      if (!found || found.isParent() || found.isSubCommandGroup()) {
        return false;
      }

      command = found;
      customIdExtra = decoded.extra;
    }

    if (!command) return false;

    const { metadata, executionId } = this.createOrPopulateMeta({
      meta,
      command,
      customIdExtra,
      interaction,
      extraData: [],
    });

    try {
      await this.executor.execute(command, interaction, metadata);
    } catch (error) {
      const wrapped = new Error(
        `Uncaught executor error while executing command '${String(executionId)}'.`,
        { cause: error },
      );
      await this.executor
        .getErrorHandler()
        .handle(wrapped, command, [interaction, metadata]);
      return false;
    }

    Promise.resolve(
      this.eventBus.emit(CommandEventEnum.CommandRun, [
        command,
        interaction,
        metadata,
      ]),
    ).catch((_error) => {});

    return true;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<
      CommandEventArgs<CoreInteractionTypes>,
      keyof CommandEventArgs<CoreInteractionTypes>
    >[]
  ): Promise<this> {
    await this.eventBus.subscribe(...subscribers);
    return this;
  }

  public async deploy(): Promise<void> {
    await this.deployer.deploy();
  }

  public getExecutor(): CommandExecutor<CoreInteractionTypes> {
    return this.executor;
  }

  public setExecutor(executor: CommandExecutor<CoreInteractionTypes>): this {
    this.executor = executor;
    return this;
  }

  public getCustomIdCodec(): CommandCustomIdCodec {
    return this.customIdCodec;
  }

  public setCustomIdCodec(codec: CommandCustomIdCodec): this {
    this.customIdCodec = codec;
    return this;
  }

  public getResolver(): CommandResolver<CoreInteractionTypes> {
    return this.resolver;
  }

  public setResolver(resolver: CommandResolver<CoreInteractionTypes>): this {
    this.resolver = resolver;
    return this;
  }

  public getRepository(): CommandRepository<CoreInteractionTypes> {
    return this.repository;
  }

  public setRepository(
    repository: CommandRepository<CoreInteractionTypes>,
  ): this {
    if (this.repository.getCommands().size) {
      throw new IllegalStateError(
        'Cannot set repository while commands are registered.',
      );
    }
    this.repository = repository;
    return this;
  }

  public getSubscriptions(): CommandSubscriptionsContainer<MappedEvents> {
    return this.subscriptionsContainer;
  }

  public async setSubscriptions(
    subscriptions: CommandSubscriptionsContainer<MappedEvents>,
  ): Promise<this> {
    await this.subscriptionsContainer.unsubscribe();
    this.subscriptionsContainer = subscriptions;
    return this;
  }

  public getEventBus(): EventBus<CommandEventArgs<CoreInteractionTypes>> {
    return this.eventBus;
  }

  public async setEventBus(
    eventBus: EventBus<CommandEventArgs<CoreInteractionTypes>>,
  ): Promise<this> {
    const oldSubscribers = [...this.eventBus.getSubscribers().values()];
    await eventBus.subscribe(...oldSubscribers);

    const oldMetadataFields = this.eventBus.getMetadataFactory().getFields();
    for (const pair of oldMetadataFields) {
      eventBus.getMetadataFactory().addDefaultField(...pair);
    }
    this.eventBus = eventBus;
    return this;
  }

  public getDeployer(): ReadonlyCommandDeployer<
    CoreInteractionTypes,
    APIApplicationCommand
  > {
    return this.deployer;
  }

  public setDeployer(
    deployer: CommandDeployer<CoreInteractionTypes, APIApplicationCommand>,
  ): this {
    if (this.deployer.getMappings().size) {
      throw new IllegalStateError(
        'Cannot set deployer after commands are deployed.',
      );
    }
    this.deployer = deployer;
    return this;
  }

  public getMetadataFactory(): MetadataFactory {
    return this.metaFactory;
  }

  /** Creates a meta collection for a session, or populates an existing one. */
  protected createOrPopulateMeta(options: {
    meta: Metadata | undefined;
    command: AnyExecutableCommand<CoreInteractionTypes>;
    customIdExtra: string | null;
    interaction:
      | CommandExecutableInteraction<CoreInteractionTypes>
      | ToEventProps<APIApplicationCommandAutocompleteInteraction>;
    extraData: { name: string; value: string }[];
  }): {
    metadata: Metadata;
    executionId: Identifier;
  } {
    const commandName = options.command.getNameTree().join(' ');

    const executionData = [
      { name: 'Command', value: commandName },
      { name: 'Date', value: new Date().toISOString() },
      { name: 'Interaction ID', value: `${options.interaction.data.id}` },
      { name: 'Interaction Type', value: `${options.interaction.data.type}` },
      ...options.extraData,
    ];
    const executionId = Symbol(
      executionData.map((e) => `${e.name} '${e.value}'`).join(' | '),
    );

    const metadata = this.metaFactory.createOrPopulate(
      options.meta,
      executionId,
    );
    if (options.customIdExtra) {
      TypedFields.CustomIdExtra.set(metadata, options.customIdExtra);
    }

    return {
      metadata,
      executionId: executionId,
    };
  }
}
