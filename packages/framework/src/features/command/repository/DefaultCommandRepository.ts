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

import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import type {
  ClassImplements,
  Command,
  CommandRepository,
  ImplementsParentCommand,
  ImplementsStandaloneCommand,
  ImplementsSubCommand,
  ImplementsSubCommandGroup,
  SubCommand,
  SubCommandGroup,
  TopLevelCommand,
} from '@nyx-discord/core';
import { IllegalDuplicateError, ObjectNotFoundError } from '@nyx-discord/core';

export class DefaultCommandRepository implements CommandRepository {
  protected readonly commands: Collection<string, TopLevelCommand> =
    new Collection<string, TopLevelCommand>();

  public get size() {
    return this.commands.size;
  }

  public static create(): CommandRepository {
    return new DefaultCommandRepository();
  }

  public onSetup(): void {
    /** Do nothing by default. */
  }

  public addCommand(command: TopLevelCommand): this {
    const commandId = command.getId();
    const existentCommand = this.commands.get(commandId);
    if (existentCommand) {
      throw new IllegalDuplicateError(
        existentCommand,
        command,
        `The command '${command.constructor.name}' wasn't added. Another command '${existentCommand.constructor.name}' already exists with that ID.`,
      );
    }

    this.commands.set(commandId, command);
    return this;
  }

  public removeCommand(command: TopLevelCommand): this {
    const commandId = command.getId();
    if (!this.commands.has(commandId)) {
      throw new ObjectNotFoundError(
        `The command '${command.constructor.name}' wasn't removed. A command with that ID doesn't exist.`,
      );
    }

    this.commands.delete(commandId);
    return this;
  }

  public getCommandByName(id: string): TopLevelCommand | null {
    return this.commands.get(id) ?? null;
  }

  public isCommandId(id: string): boolean {
    return this.commands.has(id);
  }

  public isCommandInstance(instance: TopLevelCommand): boolean {
    return this.commands.find((command) => command === instance) !== undefined;
  }

  public locateByClassTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandGroupClass: T,
  ): InstanceType<T> | null;
  public locateByClassTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandGroupClass: ImplementsSubCommandGroup,
    SubCommandClass: T,
  ): InstanceType<T> | null;
  public locateByClassTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandClass: T,
  ): InstanceType<T> | null;
  public locateByClassTree<T extends ImplementsParentCommand>(
    ParentCommandClass: T,
  ): InstanceType<T> | null;
  public locateByClassTree<T extends ImplementsStandaloneCommand>(
    StandaloneCommandClass: T,
  ): InstanceType<T> | null;
  public locateByClassTree<T extends ClassImplements<Command<unknown>>>(
    TopLevelCommandClass: ClassImplements<TopLevelCommand>,
    FirstChildClass?: ImplementsSubCommandGroup | ImplementsSubCommand,
    SecondChildClass?: ImplementsSubCommand,
  ): InstanceType<T> | null {
    let command: Command<unknown> | null =
      this.commands.find(
        (registeredCommand) =>
          registeredCommand instanceof TopLevelCommandClass,
      ) ?? null;
    if (!command) return null;

    if (!FirstChildClass) return command as InstanceType<T>;

    if (command.isParent()) {
      command = command.findChildByClass(FirstChildClass);
      if (!command) return null;

      if (!SecondChildClass) return command as InstanceType<T>;

      if (command.isSubCommandGroup()) {
        command = command.findChildByClass(SecondChildClass);
      }
    }
    return (command as InstanceType<T>) ?? null;
  }

  public locateByNameTree(parent: string): TopLevelCommand | null;
  public locateByNameTree(
    parent: string,
    firstChild: string,
  ): SubCommand | SubCommandGroup | null;
  public locateByNameTree(
    parent: string,
    firstChild: string,
    secondChild: string,
  ): SubCommand | null;
  public locateByNameTree(
    parent: string,
    firstChild?: string,
    secondChild?: string,
  ): TopLevelCommand | SubCommand | SubCommandGroup | null {
    const parentCommand = this.commands.get(parent) ?? null;
    if (!firstChild) return parentCommand;
    if (!parentCommand || !parentCommand.isParent()) return null;

    const firstChildCommand = parentCommand.findChildByName(firstChild);
    if (!secondChild) return firstChildCommand;
    if (!firstChildCommand || !firstChildCommand.isSubCommandGroup()) {
      return null;
    }

    return firstChildCommand.findChildByName(secondChild);
  }

  public getCommands(): ReadonlyCollection<string, TopLevelCommand> {
    return this.commands;
  }

  public *entries(): IterableIterator<[string, TopLevelCommand]> {
    yield* this.commands.entries();
  }

  public *keys(): IterableIterator<string> {
    yield* this.commands.keys();
  }

  public *values(): IterableIterator<TopLevelCommand> {
    yield* this.commands.values();
  }

  public next(): IteratorResult<[string, TopLevelCommand]> {
    return this.entries().next();
  }

  public [Symbol.iterator](): IterableIterator<[string, TopLevelCommand]> {
    return this.entries();
  }
}
