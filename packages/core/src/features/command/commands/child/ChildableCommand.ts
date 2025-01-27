import type { ReadonlyCollection } from '@discordjs/collection';
import type { ClassImplements } from '../../../../types/ClassImplements';
import type { Command } from '../Command';
import type { ChildCommand } from './ChildCommand';

/** A command that can contain {@link ChildCommand children commands}. */
export interface ChildableCommand<Data, Child extends ChildCommand<any, any>>
  extends Command<Data> {
  /** The number of children this command has. */
  readonly size: number;

  /**
   * Adds a list of children to this command.
   * @throws {IllegalDuplicateError} If there's already a registered child with
   *   the name of a child in the list.
   * @throws {RangeError} If adding this child list would make this command
   *   surpass its max children. See {@link getMaxChildren}.
   * @throws {AssertionError} If one of the child's parent is not this command.
   */
  addChildren(...children: Child[]): this;

  /**
   * Removes a child by its instance.
   * @throws {ObjectNotFoundError} If the specified child doesn't exist.
   * @throws {RangeError} If removing this child would leave the command with
   *   no children.
   */
  removeChildByInstance(child: Child): this;

  /**
   * Removes a child by its name.
   * @throws {ObjectNotFoundError} If the specified child doesn't exist.
   * @throws {RangeError} If removing this child would leave the command with no children.
   */
  removeChildByName(child: string): this;

  /** Finds a child by its name. */
  findChildByName(name: string): Child | null;

  /** Returns the children that is an instance of the passed class. */
  findChildByClass<SearchedChild extends ClassImplements<Child>>(
    child: SearchedChild,
  ): InstanceType<SearchedChild> | null;

  /** Returns the children belonging to this command, keyed by their name. */
  getChildren(): ReadonlyCollection<string, Child>;

  /** Returns the maximum amount of children that this command can hold. */
  getMaxChildren(): number;
}
