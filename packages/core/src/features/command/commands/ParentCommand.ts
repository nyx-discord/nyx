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

import type { SlashCommandSubcommandsOnlyBuilder, Snowflake } from 'discord.js';

import type { Identifiable } from '../../../identity/Identifiable';
import type { ChildableCommand } from './child/ChildableCommand';
import type { SubCommand } from './SubCommand.js';
import type { SubCommandGroup } from './SubCommandGroup.js';

/**
 * A top level command that serves only to contain {@link SubCommand
 * subcommands} or {@link SubCommandGroup subcommand groups}. ParentCommands
 * cannot be executed by themselves, a subcommand must be specified.
 */
export interface ParentCommand
  extends ChildableCommand<
      ReturnType<SlashCommandSubcommandsOnlyBuilder['toJSON']>,
      SubCommand | SubCommandGroup
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
