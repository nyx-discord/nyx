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
import type {
  ApplicationCommand,
  AutocompleteInteraction,
  Client,
  ClientEvents,
} from 'discord.js';
import { InteractionType } from 'discord.js';
import type { DjsInteractionTypes } from '../../types/DjsInteractionTypes.js';
import { DefaultCommandDeployer } from './deploy/DefaultCommandDeployer.js';
import { DefaultCommandAutocompleteSubscriber } from './events/DefaultCommandAutocompleteSubscriber.js';
import { DefaultCommandInteractionSubscriber } from './events/DefaultCommandInteractionSubscriber.js';
import { DefaultCommandSubscriptionsContainer } from './events/DefaultCommandSubscriptionsContainer.js';
import { DefaultCommandExecutor } from './execution/DefaultCommandExecutor.js';
import { DefaultCommandResolver } from './resolve/DefaultCommandResolver.js';

type CommandManagerOptions = {
  subscriptionsContainer: CommandSubscriptionsContainer<ClientEvents>;
  resolver: CommandResolver<DjsInteractionTypes>;
  repository: CommandRepository<DjsInteractionTypes>;
  executor: CommandExecutor<DjsInteractionTypes>;
  customIdCodec: CommandCustomIdCodec;
  deployer: CommandDeployer<DjsInteractionTypes, ApplicationCommand>;
  eventBus: EventBus<CommandEventArgs<DjsInteractionTypes>>;
  metaFactory: MetadataFactory;
};

export class DefaultCommandManager implements CommandManager<
  DjsInteractionTypes,
  ClientEvents,
  ApplicationCommand
> {
  protected subscriptionsContainer: CommandSubscriptionsContainer<ClientEvents>;

  protected resolver: CommandResolver<DjsInteractionTypes>;

  protected repository: CommandRepository<DjsInteractionTypes>;

  protected executor: CommandExecutor<DjsInteractionTypes>;

  protected customIdCodec: CommandCustomIdCodec;

  protected deployer: CommandDeployer<DjsInteractionTypes, ApplicationCommand>;

  protected eventBus: EventBus<CommandEventArgs<DjsInteractionTypes>>;

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
    client: Client;
    clientBus: EventBus<ClientEvents>;
    injections?: Partial<CommandManagerOptions>;
  }): CommandManager<DjsInteractionTypes, ClientEvents, ApplicationCommand> {
    const constructorOptions: Partial<CommandManagerOptions> =
      options.injections ?? {};
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

    ensureKey(
      constructorOptions,
      'eventBus',
      BasicEventBus.createAsync<CommandEventArgs<DjsInteractionTypes>>(
        metaFactory,
      ),
    );
    ensureKey(
      constructorOptions,
      'repository',
      DefaultCommandRepository.create<DjsInteractionTypes>(),
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
      DefaultCommandDeployer.create(options.client),
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
    ...commands: TopLevelCommand<DjsInteractionTypes>[]
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
    ...commands: TopLevelCommand<DjsInteractionTypes>[]
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
    ...commands: TopLevelCommand<DjsInteractionTypes>[]
  ): Promise<this> {
    for (const command of commands) {
      this.repository.removeCommand(command);
      this.repository.addCommand(command);
    }

    await this.deployer.editCommands(...commands);

    return this;
  }

  public async setCommands(
    ...commands: TopLevelCommand<DjsInteractionTypes>[]
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
    interaction: AutocompleteInteraction,
    meta?: Metadata,
  ): Promise<boolean> {
    const command = this.resolver.resolveFromAutocompleteInteraction(
      interaction,
      this.repository,
    );
    if (!command) return false;

    const option = interaction.options.getFocused(true);
    const { metadata, executionId } = this.createOrPopulateMeta({
      meta,
      command,
      customIdExtra: null,
      interaction,
      extraData: [
        { name: 'Option', value: option.name },
        { name: 'Value', value: option.value },
      ],
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

    return interaction.responded;
  }

  public async execute(
    interaction: CommandExecutableInteraction<DjsInteractionTypes>,
    meta?: Metadata,
  ): Promise<boolean> {
    let command: AnyExecutableCommand<DjsInteractionTypes> | null;
    let customIdExtra: string | null = null;

    if (interaction.type === InteractionType.ApplicationCommand) {
      command = this.resolver.resolveFromCommandInteraction(
        interaction,
        this.repository,
      );
    } else {
      const { customId } = interaction;

      const data = this.customIdCodec.deserialize(customId);
      if (!data) return false;

      const found = this.resolver.resolveFromCustomIdData(
        data,
        this.repository,
      );
      if (!found || found.isParent() || found.isSubCommandGroup()) {
        return false;
      }

      command = found;
      customIdExtra = data.extra;
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
      return interaction.replied;
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
      CommandEventArgs<DjsInteractionTypes>,
      keyof CommandEventArgs<DjsInteractionTypes>
    >[]
  ): Promise<this> {
    await this.eventBus.subscribe(...subscribers);
    return this;
  }

  public async deploy(): Promise<void> {
    await this.deployer.deploy();
  }

  public getExecutor(): CommandExecutor<DjsInteractionTypes> {
    return this.executor;
  }

  public setExecutor(executor: CommandExecutor<DjsInteractionTypes>): this {
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

  public getResolver(): CommandResolver<DjsInteractionTypes> {
    return this.resolver;
  }

  public setResolver(resolver: CommandResolver<DjsInteractionTypes>): this {
    this.resolver = resolver;
    return this;
  }

  public getRepository(): CommandRepository<DjsInteractionTypes> {
    return this.repository;
  }

  public setRepository(
    repository: CommandRepository<DjsInteractionTypes>,
  ): this {
    if (this.repository.getCommands().size) {
      throw new IllegalStateError(
        'Cannot set repository while commands are registered.',
      );
    }
    this.repository = repository;
    return this;
  }

  public getSubscriptions(): CommandSubscriptionsContainer<ClientEvents> {
    return this.subscriptionsContainer;
  }

  public async setSubscriptions(
    subscriptions: CommandSubscriptionsContainer<ClientEvents>,
  ): Promise<this> {
    await this.subscriptionsContainer.unsubscribe();
    this.subscriptionsContainer = subscriptions;
    return this;
  }

  public getEventBus(): EventBus<CommandEventArgs<DjsInteractionTypes>> {
    return this.eventBus;
  }

  public async setEventBus(
    eventBus: EventBus<CommandEventArgs<DjsInteractionTypes>>,
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
    DjsInteractionTypes,
    ApplicationCommand
  > {
    return this.deployer;
  }

  public setDeployer(
    deployer: CommandDeployer<DjsInteractionTypes, ApplicationCommand>,
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
    command: AnyExecutableCommand<DjsInteractionTypes>;
    customIdExtra: string | null;
    interaction:
      | CommandExecutableInteraction<DjsInteractionTypes>
      | AutocompleteInteraction;
    extraData: { name: string; value: string }[];
  }): {
    metadata: Metadata;
    executionId: Identifier;
  } {
    const commandName = options.command.getNameTree().join(' ');

    const executionData = [
      { name: 'Command', value: commandName },
      { name: 'Date', value: new Date().toISOString() },
      { name: 'Interaction ID', value: `${options.interaction.id}` },
      { name: 'Interaction Type', value: `${options.interaction.type}` },
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
