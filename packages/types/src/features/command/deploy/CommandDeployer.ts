import type { APIApplicationCommand } from 'discord-api-types/v10';
import type { ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable } from '../../../types/Awaitable.js';
import type { InteractionTypes } from '../InteractionTypes';
import type { TopLevelCommand } from '../commands/TopLevelCommand';

export interface CommandDeployer<
  Types extends InteractionTypes = InteractionTypes,
  ApplicationCommand = APIApplicationCommand,
> extends IterableIterator<ApplicationCommand> {
  /**
   * Deploys pending commands, or all of them it the deployer hasn't started.
   *
   * @throws {IllegalStateError} If the deployer has already started.
   * @throws {Error} If there was an error while deploying the commands.
   */
  deploy(): Awaitable<ReadonlyCollection<string, ApplicationCommand>>;

  /**
   * Sets this deployer's commands, or the pending ones if it hasn't started.
   *
   * @throws {Error} If there was an error while deploying the commands.
   */
  setCommands(...commands: TopLevelCommand<Types>[]): Awaitable<this>;

  /**
   * Registers commands on Discord if the deployer has started, otherwise
   * saves them for later.
   *
   * @throws {AssertionError} If a command is already registered.
   * @throws {Error} If there was an error while building or deploying the commands.
   */
  deployCommands(...commands: TopLevelCommand<Types>[]): Awaitable<this>;

  /**
   * Unregisters commands on Discord if the deployer has started, otherwise
   * removes them from the pending add list.
   *
   * @throws {ObjectNotFoundError} If that command is not deployed or in the pending add list.
   * @throws {Error} If there was an error while undeploying the commands.
   */
  removeCommands(...commands: TopLevelCommand<Types>[]): Awaitable<this>;

  /**
   * Edits commands on Discord. Requires the deployer to have started.
   *
   * @throws {IllegalStateError} If the deployer has not started.
   * @throws {ObjectNotFoundError} If that command is not deployed.
   * @throws {Error} If there was an error while editing the commands.
   */
  editCommands(...commands: TopLevelCommand<Types>[]): Awaitable<this>;

  /**
   * Returns the Discord ApplicationCommands that have been deployed,
   * keyed by the command ID.
   *
   * Use them only to extract data. Prefer this object's (or the CommandManager's)
   * methods to add/remove/edit commands.
   */
  getMappings(): ReadonlyCollection<string, ApplicationCommand>;

  /** Returns an iterator for the deployed ApplicationCommands. */
  values(): IterableIterator<ApplicationCommand>;

  /** Returns an iterator for the deployed commands' IDs. */
  keys(): IterableIterator<string>;

  /** Returns an iterator for the deployed commands. */
  entries(): IterableIterator<[string, ApplicationCommand]>;
}
