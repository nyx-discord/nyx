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

import type { Awaitable } from 'discord.js';

import type { Filterable } from '../../../../filter/Filterable';
import type { CommandExecutionMeta } from '../../execution/meta/CommandExecutionMeta';
import type { CommandFilter } from '../../filter/CommandFilter';
import type { ApplicationCommandInteraction } from '../../interaction/ApplicationCommandInteraction';
import type { ComponentCommandInteraction } from '../../interaction/ComponentCommandInteraction';
import type { Command } from '../Command';

/** A command that can be executed by an interaction. */
export interface ExecutableCommand<
  Data,
  Interaction extends ApplicationCommandInteraction,
> extends Command<Data>,
    Filterable<CommandFilter> {
  /** Executes this command from an interaction. */
  execute(
    interaction: Interaction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Handle a ComponentCommandInteraction whose customId refers to this command. */
  handleInteraction(
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
