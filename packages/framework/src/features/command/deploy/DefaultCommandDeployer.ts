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
import type { CommandDeployer, TopLevelCommand } from '@nyx-discord/core';
import {
  AssertionError,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { ApplicationCommand, Client, Snowflake } from 'discord.js';

export class DefaultCommandDeployer implements CommandDeployer {
  protected readonly client: Client;

  protected readonly mappings: Collection<string, ApplicationCommand> =
    new Collection();

  // Array while unstarted, null if started
  protected pendingAdd: TopLevelCommand[] | null = [];

  constructor(client: Client) {
    this.client = client;
  }

  public async start(): Promise<this> {
    if (this.pendingAdd === null) {
      throw new IllegalStateError('Already started.');
    }

    await this.deploy(...this.pendingAdd);
    this.pendingAdd = null;

    return this;
  }

  public async addCommands(...commands: TopLevelCommand[]): Promise<this> {
    if (this.pendingAdd === null) {
      await this.deploy(...commands);
    } else {
      this.pendingAdd.push(...commands);
    }

    return this;
  }

  public async removeCommands(...commands: TopLevelCommand[]): Promise<this> {
    if (this.pendingAdd === null) {
      await this.unDeploy(...commands);
    } else {
      for (const command of commands) {
        const index = this.pendingAdd.indexOf(command);
        if (index === -1) {
          throw new AssertionError('Command not found in pending add.');
        }

        this.pendingAdd.splice(index, 1);
      }
    }

    return this;
  }

  public async editCommands(...commands: TopLevelCommand[]): Promise<this> {
    const applicationManager = this.client.application?.commands;
    if (!applicationManager) {
      throw new IllegalStateError('Cannot update commands while not started.');
    }

    for (const command of commands) {
      const id = command.getId();
      const applicationCommand = this.mappings.get(id);
      if (!applicationCommand) {
        throw new ObjectNotFoundError(`Command application not found: ${id}.`);
      }

      const newMapping = await applicationManager.edit(
        applicationCommand,
        command.getData(),
      );

      this.mappings.set(id, newMapping);
    }

    return this;
  }

  public getMappings(): ReadonlyCollection<string, ApplicationCommand> {
    return this.mappings;
  }

  public *keys(): IterableIterator<string> {
    yield* this.mappings.keys();
  }

  public *values(): IterableIterator<ApplicationCommand> {
    yield* this.mappings.values();
  }

  public *entries(): IterableIterator<[string, ApplicationCommand]> {
    yield* this.mappings.entries();
  }

  public next(): IteratorResult<ApplicationCommand> {
    return this.values().next();
  }

  public [Symbol.iterator](): IterableIterator<ApplicationCommand> {
    return this.values();
  }

  protected async unDeploy(...commands: TopLevelCommand[]): Promise<void> {
    const applicationManager = this.client.application?.commands;
    if (!applicationManager) {
      throw new IllegalStateError('Cannot update commands while not started.');
    }

    for (const command of commands) {
      const id = command.getId();
      const mapping = this.mappings.get(id);
      if (!mapping) {
        throw new ObjectNotFoundError(`Command not found: ${id}.`);
      }

      await applicationManager.delete(mapping);
      this.mappings.delete(id);
    }
  }

  protected async deploy(...commands: TopLevelCommand[]): Promise<void> {
    const applicationManager = this.client.application?.commands;
    if (!applicationManager) {
      throw new IllegalStateError('Cannot update commands while not started.');
    }

    // Aggregate to Collection<guildId | null if global, commands> to minimize API calls
    const guildAggregate = new Collection<
      Snowflake | null,
      TopLevelCommand[]
    >();
    for (const command of commands) {
      const possibleDuplicate = this.mappings.get(command.getId());
      if (possibleDuplicate) {
        throw new AssertionError(
          `Already deployed command ${command}, found duplicate: '${possibleDuplicate}'.`,
        );
      }

      const guilds = command.getGuilds();
      for (const guild of guilds ?? [null]) {
        const guildCommands = guildAggregate.get(guild) ?? [];
        guildCommands.push(command);
        guildAggregate.set(guild, guildCommands);
      }
    }

    const deployPromises: Promise<void>[] = [];
    for (const [guild, guildCommands] of guildAggregate) {
      const promise = Promise.resolve().then<void>(async () => {
        const datas = guildCommands.map((command) => command.getData());

        const result =
          guild === null
            ? await applicationManager.set(datas)
            : await applicationManager.set(datas, guild);

        this.mapCommands(result.values(), guildCommands);
      });

      deployPromises.push(promise);
    }

    await Promise.all(deployPromises);
  }

  protected mapCommands(
    applications: IterableIterator<ApplicationCommand>,
    commands: TopLevelCommand[],
  ): void {
    for (const application of applications) {
      const name = application.name;
      const command = commands.find((command) => {
        const data = command.getData();
        return data.name === name && data.type === application.type;
      });

      if (!command) {
        throw new ObjectNotFoundError(
          `Could not associate any command in '${commands}' with an application of type '${application.type}' and name '${name}'.`,
        );
      }

      // We assume duplicates have already been checked
      this.mappings.set(command.getId(), application);
    }
  }
}
