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
  StandaloneCommand,
} from '@nyx-discord/core';
import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  Snowflake,
} from 'discord.js';

import { AbstractExecutableCommand } from './executable/AbstractExecutableCommand';

export abstract class AbstractStandaloneCommand
  extends AbstractExecutableCommand<
    ReturnType<SlashCommandOptionsOnlyBuilder['toJSON']>,
    ChatInputCommandInteraction
  >
  implements StandaloneCommand
{
  public getName(): string {
    return this.createData().name;
  }

  public getData(): ReturnType<SlashCommandBuilder['toJSON']> {
    return this.createData().toJSON();
  }

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.createData().name;
  }

  public override isStandalone(): this is StandaloneCommand {
    return true;
  }

  public abstract autocomplete(
    interaction: AutocompleteInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  public getNameTree(): ReadonlyArray<string> {
    return [this.getName()];
  }

  /** Returns this command's data. */
  protected abstract createData(): SlashCommandOptionsOnlyBuilder;
}
