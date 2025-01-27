import type { AutocompleteInteraction, Awaitable } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { EventBus } from '../event/bus/EventBus.js';
import type { EventSubscriber } from '../event/subscriber/EventSubscriber.js';
import type { TopLevelCommand } from './commands/TopLevelCommand.js';
import type { CommandCustomIdCodec } from './customId/CommandCustomIdCodec.js';
import type { ReadonlyCommandDeployer } from './deploy/ReadonlyCommandDeployer';
import type { CommandSubscriptionsContainer } from './event/CommandSubscriptionsContainer.js';
import type { CommandEventArgs } from './events/CommandEvent.js';
import type { CommandExecutor } from './execution/executor/CommandExecutor.js';
import type { CommandExecutionMeta } from './execution/meta/CommandExecutionMeta.js';
import type { CommandExecutableInteraction } from './interaction/CommandExecutableInteraction.js';
import type { ReadonlyCommandRepository } from './repository/ReadonlyCommandRepository.js';
import type { CommandResolver } from './resolve/CommandResolver';

/** An object that holds methods for interacting with the bot's {@link Command commands}. */
export interface CommandManager extends BotAware, BotLifecycleObserver {
  /**
   * Executes a command using the {@link CommandExecutor}.
   * @fires CommandEvent#CommandRun
   * @returns {Promise<boolean>} A Promise that resolves to true if the command
   *                             is executed successfully.
   */
  execute(
    source: CommandExecutableInteraction,
    meta?: CommandExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Autocompletes a command using the {@link CommandExecutor}.
   * @fires CommandEvent#CommandAutocomplete
   * @returns {Promise<boolean>} A Promise that resolves to true if the
   *                             autocompletion is successful.
   */
  autocomplete(
    interaction: AutocompleteInteraction,
    meta?: CommandExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Adds {@link TopLevelCommand commands} and registers them on Discord, if the
   * bot has started.
   *
   * @fires CommandEvent#CommandAdd
   * @throws {IllegalDuplicateError} If a command with that same data exists.
   */
  addCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Removes a {@link TopLevelCommand command} and unregisters it from Discord,
   * if the bot has started.
   *
   * @fires CommandEvent#CommandRemove
   * @throws {ObjectNotFoundError} If that command is not registered.
   */
  removeCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Edits commands on Discord. Requires the bot to have started.
   *
   * @throws {IllegalStateError} If the bot has not started.
   * @throws {ObjectNotFoundError} If that command is not deployed.
   * @throws {Error} If there was an error while editing the commands.
   */
  editCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Sets commands on Discord, or the pending ones if the bot hasn't started.
   *
   * @fires CommandEvent#CommandAdd For each command that was added.
   * @fires CommandEvent#CommandRemove For each command that was removed.
   * @throws {Error} If the bot has already started, and there was an error while setting the commands.
   */
  setCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Subscribes a list of event subscribers to the manager's bus.
   *
   * Alias of:
   * ```
   * const managerBus = commandManager.getEventBus();
   * await managerBus.subscribe(subscriber);
   * ```
   */
  subscribe(
    ...subscribers: EventSubscriber<CommandEventArgs, keyof CommandEventArgs>[]
  ): Awaitable<this>;

  /**
   * Deploys the commands on Discord, if that wasn't already done on
   * the start phase.
   *
   * @throws {IllegalStateError} If the deployer has already started.
   * @throws {Error} If there was an error while deploying the commands.
   */
  deploy(): Awaitable<void>;

  /** Returns the {@link CommandSubscriptionsContainer} for this manager. */
  getSubscriptions(): CommandSubscriptionsContainer;

  /** Returns the {@link CommandCustomIdCodec} for this manager. */
  getCustomIdCodec(): CommandCustomIdCodec;

  /** Returns the {@link CommandResolver} for this manager. */
  getResolver(): CommandResolver;

  /** Returns the {@link CommandExecutor} for this manager. */
  getExecutor(): CommandExecutor;

  /** Returns the {@link CommandRepository} for this manager. */
  getRepository(): ReadonlyCommandRepository;

  /** Returns the {@link EventBus} for this manager. */
  getEventBus(): EventBus<CommandEventArgs>;

  /** Returns the {@link CommandDeployer} for this manager. */
  getDeployer(): ReadonlyCommandDeployer;
}
