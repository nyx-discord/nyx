import type { ReadonlyCollection } from '@discordjs/collection';
import type { ClassImplements } from '../../../types/ClassImplements.js';
import type { Nameable } from '../../../types/Nameable';
import type { InteractionTypes } from '../InteractionTypes';
import type { Command } from '../commands/Command';
import type { ImplementsParentCommand } from '../commands/implements/ImplementsParentCommand.js';
import type { ImplementsStandaloneCommand } from '../commands/implements/ImplementsStandaloneCommand.js';
import type { ImplementsSubCommand } from '../commands/implements/ImplementsSubCommand.js';
import type { ImplementsSubCommandGroup } from '../commands/implements/ImplementsSubCommandGroup.js';
import type { SubCommand } from '../commands/SubCommand';
import type { SubCommandGroup } from '../commands/SubCommandGroup';
import type { TopLevelCommand } from '../commands/TopLevelCommand.js';

/** An object responsible for storing commands. */
export interface CommandRepository<
  Types extends InteractionTypes = InteractionTypes,
> extends IterableIterator<[string, TopLevelCommand<Types>]> {
  /** Returns the number of stored commands. */
  readonly size: number;

  /**
   * Adds a {@link TopLevelCommand command}.
   *
   * @throws {IllegalDuplicateError} If a command with that same data exists.
   */
  addCommand(command: TopLevelCommand<Types>): this;

  /**
   * Removes a {@link TopLevelCommand command}.
   *
   * @throws {ObjectNotFoundError} If that command is not registered.
   */
  removeCommand(command: TopLevelCommand<Types>): this;

  /** Returns whether the passed ID belongs to a registered command. */
  isCommandId(id: string): boolean;

  /** Returns whether the passed command is registered. */
  isCommandInstance(instance: TopLevelCommand<Types>): boolean;

  /** Returns the command associated with the passed name. */
  getCommandByName(id: string): TopLevelCommand<Types> | null;

  /**
   * Locates a {@link TopLevelCommand} by its name tree.
   * Equal to {@link CommandRepository#getCommandByName}.
   */
  locateByNameTree(name: string): TopLevelCommand<Types> | null;

  /** Locates a {@link SubCommand} or {@link SubCommandGroup} by its name tree. */
  locateByNameTree(
    parent: string,
    child: string,
  ): SubCommand<Types> | SubCommandGroup<Types> | null;

  /** Locates a {@link SubCommand} by its name tree. */
  locateByNameTree(
    parent: string,
    group: string,
    subCommand: string,
  ): SubCommand<Types> | null;

  /** Locates a {@link Command} by its name tree. */
  locateByNameTree(
    parent: string,
    firstChild?: string,
    secondChild?: string,
  ): TopLevelCommand<Types> | SubCommand<Types> | SubCommandGroup<Types> | null;

  /**
   * Locates a {@link SubCommandGroup} by its class tree, passing its
   * parent and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommandGroup
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeSubCommandGroup); // null
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommandGroup); // Stored instance of SomeSubCommandGroup
   */
  locateByClassTree<T extends ImplementsSubCommandGroup<Types>>(
    ParentCommandClass: ImplementsParentCommand<Types>,
    SubCommandGroupClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link SubCommand} by its declaration tree, passing its parent,
   * group and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommandGroup
   * //    --- ChildSubCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(ChildSubCommand); // null
   * repo.locateByClassTree(SomeParentCommand, ChildSubCommand); // null
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommandGroup, ChildSubCommand); // Stored instance of ChildSubCommand
   */
  locateByClassTree<T extends ImplementsSubCommand<Types>>(
    ParentCommandClass: ImplementsParentCommand<Types>,
    SubCommandGroupClass: ImplementsSubCommandGroup<Types>,
    SubCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link SubCommand} by its declaration tree, passing its parent
   * class and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeSubCommand); // null
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommand); // Stored instance of SomeSubCommand
   */
  locateByClassTree<T extends ImplementsSubCommand<Types>>(
    ParentCommandClass: ImplementsParentCommand<Types>,
    SubCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link ParentCommand} by its declaration tree, passing its class
   * and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeParentCommand); // Stored instance of SomeParentCommand
   */
  locateByClassTree<T extends ImplementsParentCommand<Types>>(
    ParentCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link StandaloneCommand} by its declaration tree, passing its
   * class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeStandaloneCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeStandaloneCommand); // Stored instance of SomeStandaloneCommand
   */
  locateByClassTree<T extends ImplementsStandaloneCommand<Types>>(
    StandaloneCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a stored command by its declaration tree, passing its constructors
   * and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeStandaloneCommand
   * // - SomeParentCommand
   * //  -- SomeSubCommand
   * //  -- SomeSubCommandGroup
   * //    --- ChildSubCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeStandaloneCommand); // Stored instance of SomeStandaloneCommand
   * repo.locateByClassTree(SomeParentCommand); // Stored instance of SomeParentCommand
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommandGroup); // Stored instance of SomeSubCommandGroup
   * repo.locateByClassTree(SomeParentCommand, ChildSubCommand); // null
   */
  locateByClassTree<T extends ClassImplements<Command<Nameable, Types>>>(
    TopLevelCommandClass: ClassImplements<TopLevelCommand<Types>>,
    FirstChildClass?:
      ImplementsSubCommandGroup<Types> | ImplementsSubCommand<Types>,
    SecondChildClass?: ImplementsSubCommand<Types>,
  ): InstanceType<T> | null;

  /** Returns the currently stored top level commands, keyed by their ID. */
  getCommands(): ReadonlyCollection<string, TopLevelCommand<Types>>;

  /** Returns an iterator of all {@link TopLevelCommand}s. */
  values(): IterableIterator<TopLevelCommand<Types>>;

  /** Returns an iterator of all command IDs. */
  keys(): IterableIterator<string>;

  /** Returns an iterator of all [ID, {@link TopLevelCommand}] pairs. */
  entries(): IterableIterator<[string, TopLevelCommand<Types>]>;

  /** Removes all stored commands. */
  clear(): void;
}
