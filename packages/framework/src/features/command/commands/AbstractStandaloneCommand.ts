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

import type {
  CommandExecutionMeta,
  CommandVisitor,
  StandaloneCommand,
  StandaloneCommandData,
  StandaloneCommandReferenceData,
} from '@nyx-discord/core';
import { ResolvedCommandType } from '@nyx-discord/core';
import type {
  Awaitable,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { ApplicationCommandType } from 'discord.js';

import { NotImplementedError } from '../../../errors/NotImplementedError.js';
import { AbstractExecutableCommand } from './abstract/AbstractExecutableCommand.js';

export abstract class AbstractStandaloneCommand
  extends AbstractExecutableCommand<StandaloneCommandData>
  implements StandaloneCommand
{
  public static readonly DefaultContextData: ReadonlyArray<ApplicationCommandType> =
    [ApplicationCommandType.ChatInput];

  protected contexts: ApplicationCommandType[] = [
    ...AbstractStandaloneCommand.DefaultContextData,
  ];

  public getContexts(): ReadonlyArray<ApplicationCommandType> {
    return this.contexts;
  }

  public override acceptVisitor(visitor: CommandVisitor<unknown>): void {
    visitor.visitStandaloneCommand(this);
  }

  public override isStandaloneCommand(): this is StandaloneCommand {
    return true;
  }

  public executeUser(
    _interaction: UserContextMenuCommandInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public executeMessage(
    _interaction: MessageContextMenuCommandInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public override getId(): string {
    const { name } = this.data;
    const contextBitmask = this.generateContextBitmask();
    return `${name}/${contextBitmask}`;
  }

  public override getData(): Readonly<StandaloneCommandData> {
    return this.data;
  }

  /** Generates a bitmask for the command's {@link contexts} data. */
  protected generateContextBitmask(): string {
    let bitmask = 0;

    for (const value of this.contexts) {
      bitmask |= value;
    }

    return bitmask.toString(10);
  }

  public toReferenceData(): StandaloneCommandReferenceData {
    return {
      type: ResolvedCommandType.StandaloneCommand,
      root: this.data.name,
      commandType: this.contexts[0],
    };
  }
}
