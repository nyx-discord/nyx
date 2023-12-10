/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
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
  ArrayMinLength,
  ClassImplements,
  Command,
  CommandData,
  CommandReferenceData,
  CommandRepository,
  ExecutableCommand,
  ImplementsParentCommand,
  ImplementsStandaloneCommand,
  ImplementsSubCommand,
  ImplementsSubCommandGroup,
  ParentCommand,
  TopLevelCommand,
} from '@nyx-discord/core';
import {
  IllegalDuplicateError,
  ObjectNotFoundError,
  ResolvedCommandType,
} from '@nyx-discord/core';

import type { ApplicationCommand, Client } from 'discord.js';

import { CommandDataVisitor } from '../visitor/CommandDataVisitor.js';

export class DefaultCommandRepository implements CommandRepository {
  protected readonly mappings: Collection<
    string,
    ArrayMinLength<ApplicationCommand, 1>
  > = new Collection<string, ArrayMinLength<ApplicationCommand, 1>>();

  protected readonly commands: Collection<string, TopLevelCommand> =
    new Collection<string, TopLevelCommand>();

  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public static create(client: Client): CommandRepository {
    return new DefaultCommandRepository(client);
  }

  public get size() {
    return this.commands.size;
  }

  public onSetup(): void {
    /** Do nothing by default. */
  }

  public async onStart(): Promise<void> {
    await this.refreshDiscord();
  }

  public onStop(): Promise<void> | void {
    /** Do nothing by default */
  }

  public async addCommand(command: TopLevelCommand): Promise<this> {
    const commandId = command.getId();
    const existentCommand = this.commands.get(commandId);
    if (existentCommand) {
      throw new IllegalDuplicateError(
        existentCommand,
        command,
        `The command '${command.constructor.name}' wasn't added. Another command '${existentCommand.constructor.name}' already exists with that ID.`,
      );
    }

    /**
     * If it's a standalone command, we need to check if another command with
     * that already handles any of its contexts already exists.
     */
    if (command.isStandaloneCommand()) {
      const existentStandaloneCommand = this.commands.find(
        (registeredCommand) => {
          if (!registeredCommand.isStandaloneCommand()) return false;

          const commandContexts = command.getContexts();
          const registeredCommandContexts = registeredCommand.getContexts();
          return commandContexts.some((element) =>
            registeredCommandContexts.includes(element),
          );
        },
      );

      if (existentStandaloneCommand) {
        throw new IllegalDuplicateError(
          existentStandaloneCommand,
          command,
          `The command '${command.constructor.name}' wasn't added. Another command '${existentStandaloneCommand.constructor.name}' already exists with that ID.`,
        );
      }
    }

    this.commands.set(commandId, command);

    await this.registerCommand(command);
    return this;
  }

  public async removeCommand(
    command: TopLevelCommand,
    throwIfAbsent = true,
  ): Promise<this> {
    const commandId = command.getId();
    if (!this.commands.has(commandId)) {
      if (!throwIfAbsent) return this;
      throw new ObjectNotFoundError(
        `The command '${command.constructor.name}' wasn't removed. A command with that ID doesn't exist.`,
      );
    }

    this.commands.delete(commandId);
    await this.refreshDiscord();
    return this;
  }

  public async updateParentCommand(command: ParentCommand): Promise<this> {
    await this.unregisterCommand(command);
    await this.registerCommand(command);

    return this;
  }

  public getCommandById(id: string): Command<CommandData> | null {
    return this.commands.get(id) ?? null;
  }

  public isCommandId(id: string): boolean {
    return this.commands.has(id);
  }

  public isCommandInstance(instance: Command<CommandData>): boolean {
    return this.commands.find((command) => command === instance) !== undefined;
  }

  public locateByTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandGroupClass: T,
  ): InstanceType<T> | null;
  public locateByTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandGroupClass: ImplementsSubCommandGroup,
    SubCommandClass: T,
  ): InstanceType<T> | null;
  public locateByTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandClass: T,
  ): InstanceType<T> | null;
  public locateByTree<T extends ImplementsParentCommand>(
    ParentCommandClass: T,
  ): InstanceType<T> | null;
  public locateByTree<T extends ImplementsStandaloneCommand>(
    StandaloneCommandClass: T,
  ): InstanceType<T> | null;
  public locateByTree<T extends ClassImplements<Command<CommandData>>>(
    TopLevelCommandClass: ClassImplements<TopLevelCommand>,
    FirstChildClass?: ImplementsSubCommandGroup | ImplementsSubCommand,
    SecondChildClass?: ImplementsSubCommand,
  ): InstanceType<T> | null {
    let command: Command<CommandData> | null =
      this.commands.find(
        (registeredCommand) =>
          registeredCommand instanceof TopLevelCommandClass,
      ) ?? null;
    if (!command) return null;

    if (!FirstChildClass) return command as InstanceType<T>;

    if (command.isParentCommand()) {
      command = command.findChildByClass(FirstChildClass);
      if (!command) return null;

      if (!SecondChildClass) return command as InstanceType<T>;

      if (command.isSubCommandGroup()) {
        command = command.findChildByClass(SecondChildClass);
      }
    }
    return (command as InstanceType<T>) ?? null;
  }

  public locateByData(
    data: CommandReferenceData,
  ): ExecutableCommand<CommandData> | null {
    const commands = this.commands.filter(
      (command) => command.getData().name === data.root,
    );
    if (!commands.size) return null;

    let topLevel;
    if (data.type !== ResolvedCommandType.StandaloneCommand) {
      topLevel = commands.first();
    } else {
      topLevel = commands.find((command) => {
        if (!command.isStandaloneCommand()) return false;

        const contexts = command.getContexts();
        const type = data.commandType;

        return contexts.includes(type);
      });
    }
    if (!topLevel) return null;

    if (topLevel.isStandaloneCommand()) {
      return data.type === ResolvedCommandType.StandaloneCommand
        ? topLevel
        : null;
    }

    if (data.type === ResolvedCommandType.StandaloneCommand) return null;

    const childName =
      data.type === ResolvedCommandType.SubCommand
        ? data.subCommand
        : data.group;

    const child = topLevel.findChildByName(childName);
    if (!child) return null;

    if (child.isSubCommand()) {
      return data.type === ResolvedCommandType.SubCommand ? child : null;
    }

    const subCommand = child.findChildByName(data.subCommand);
    if (!subCommand) return null;

    return data.type === ResolvedCommandType.SubCommandOnGroup
      ? subCommand
      : null;
  }

  public getCommands(): ReadonlyCollection<string, TopLevelCommand> {
    return this.commands;
  }

  public getMappings(): ReadonlyCollection<
    string,
    ArrayMinLength<ApplicationCommand, 1>
  > {
    return this.mappings;
  }

  public *entries(): IterableIterator<[string, TopLevelCommand]> {
    for (const [key, item] of this.commands.entries()) {
      yield [key, item];
    }
  }

  public *keys(): IterableIterator<string> {
    for (const key of this.commands.keys()) {
      yield key;
    }
  }

  public *values(): IterableIterator<TopLevelCommand> {
    for (const item of this.commands.values()) {
      yield item;
    }
  }

  public next(): IteratorResult<[string, TopLevelCommand]> {
    return this.entries().next();
  }

  public [Symbol.iterator](): IterableIterator<[string, TopLevelCommand]> {
    return this.entries();
  }

  /** Utility function to register a single command to Discord. */
  protected async registerCommand(command: TopLevelCommand): Promise<void> {
    const applicationCommandManager = this.client.application?.commands;
    if (!applicationCommandManager) return;

    const visitor = new CommandDataVisitor(command);
    const datas = visitor.visit();

    const addPromises: Promise<ApplicationCommand>[] = datas.map((data) =>
      applicationCommandManager.create(data),
    );
    const applicationCommands = (await Promise.all(
      addPromises.values(),
    )) as ArrayMinLength<ApplicationCommand, 1>;

    this.mappings.set(command.getId(), applicationCommands);
  }

  protected async unregisterCommand(command: TopLevelCommand): Promise<void> {
    const applicationCommandManager = this.client.application?.commands;
    if (!applicationCommandManager) return;

    const commandId = command.getId();
    const mappings = this.mappings.get(commandId);

    if (!mappings) return;

    const deletePromises: Promise<unknown>[] = [];

    for (const mapping of mappings) {
      deletePromises.push(mapping.delete());
    }

    await Promise.all(deletePromises);
    this.mappings.delete(commandId);
  }

  protected async refreshDiscord(): Promise<void> {
    const clientApplication = this.client.application;

    if (!clientApplication) return;

    await clientApplication.commands.set([]);

    // If no commands have been registered, simply set no commands.
    if (!this.commands.size) {
      return;
    }

    const addPromises: Promise<unknown>[] = [];

    for (const command of this.commands.values()) {
      addPromises.push(this.registerCommand(command));
    }

    await Promise.all(addPromises);
  }

  protected searchCommandForApplication(
    application: ApplicationCommand,
  ): TopLevelCommand | null {
    const { name, type } = application;
    const command = this.commands.find(
      (command) => command.getData().name === name,
    );

    if (!command) return null;
    if (!command.isStandaloneCommand()) return command;

    const contexts = command.getContexts();
    if (contexts.includes(type)) return command;

    return null;
  }
}
