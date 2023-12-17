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

import type {
  CommandOptionData,
  CommandVisitor,
  ParentCommand,
  StandaloneCommand,
  SubCommand,
  SubCommandGroup,
  TopLevelCommand,
} from '@nyx-discord/core';
import type {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  ChatInputApplicationCommandData,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';

/** An object for visiting a command structure and extracting its data. */
export class CommandDataVisitor
  implements CommandVisitor<ApplicationCommandData[]>
{
  /** The currently visited command. */
  protected command: TopLevelCommand;

  /** The generated data so far. */
  protected data: {
    ChatInput?: ChatInputApplicationCommandData & {
      options?: ApplicationCommandOptionData[];
    };
    User?: UserApplicationCommandData;
    Message?: MessageApplicationCommandData;
  } = {};

  constructor(command: TopLevelCommand) {
    this.command = command;
  }

  /** Visit the current command object. */
  public visit(): ApplicationCommandData[] {
    this.command.isParentCommand()
      ? this.visitParentCommand(this.command)
      : this.visitStandaloneCommand(this.command);
    return Array.from(Object.values(this.data));
  }

  public visitStandaloneCommand(command: StandaloneCommand): void {
    const data = this.command.getData();
    const contextMenus = command.getContexts();
    if (contextMenus.includes(ApplicationCommandType.User)) {
      this.data.User = { name: data.name, type: ApplicationCommandType.User };
    }
    if (contextMenus.includes(ApplicationCommandType.Message)) {
      this.data.Message = {
        name: data.name,
        type: ApplicationCommandType.Message,
      };
    }
    if (contextMenus.includes(ApplicationCommandType.ChatInput)) {
      this.data.ChatInput = {
        ...data,
        type: ApplicationCommandType.ChatInput,
        options: command.getOptions() as ApplicationCommandOptionData[],
      };
    }
  }

  public visitParentCommand(command: ParentCommand): void {
    if (command.size === 0 || command.size > 25) {
      throw new RangeError(
        `Can't create a parent command with children size of ${command.size}.`,
      );
    }

    for (const child of command.getChildren()) child.acceptVisitor(this);
  }

  public visitSubCommand(subcommand: SubCommand): void {
    let { ChatInput } = this.data;
    ChatInput ??= {
      ...this.command.getData(),
      type: ApplicationCommandType.ChatInput,
    };

    ChatInput.options ??= [];
    ChatInput.options.push({
      ...subcommand.getData(),
      type: ApplicationCommandOptionType.Subcommand,
      options: subcommand.getOptions() as CommandOptionData[],
    });

    this.data.ChatInput = ChatInput;
  }

  public visitSubCommandGroup(group: SubCommandGroup): void {
    if (group.size === 0 || group.size > 25) {
      throw new RangeError(
        `Can't create a subcommand group with children size of ${group.size}.`,
      );
    }

    const options: ApplicationCommandSubCommandData[] = [];
    for (const subcommand of group.getChildren()) {
      options.push({
        ...subcommand.getData(),
        type: ApplicationCommandOptionType.Subcommand,
        options: subcommand.getOptions() as CommandOptionData[],
      });
    }

    const data: ApplicationCommandSubGroupData = {
      ...group.getData(),
      type: ApplicationCommandOptionType.SubcommandGroup,
      options,
    };

    this.data.ChatInput ??= {
      ...this.command.getData(),
      type: ApplicationCommandType.ChatInput,
    };
    this.data.ChatInput.options ??= [];

    const { ChatInput } = this.data;
    ChatInput.options ??= [];
    ChatInput.options.push(data);
  }

  public refresh(command: TopLevelCommand) {
    this.command = command;
    this.data = {};
  }
}
