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
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Filterable } from '../../../../filter/Filterable.js';
import type { CommandData } from '../../data/command/CommandData.js';
import type { CommandOptionData } from '../../data/option/CommandOptionData.js';
import type { CommandExecutionMeta } from '../../execution/meta/CommandExecutionMeta.js';
import type { CommandFilter } from '../../filter/CommandFilter.js';
import type { ComponentCommandInteraction } from '../../interaction/ComponentCommandInteraction.js';
import type { Command } from './Command.js';

/** A command that can be executed (called) by an interaction. */
export interface ExecutableCommand<Data extends CommandData>
  extends Command<Data>,
    Filterable<CommandFilter<Data>> {
  /** Executes this command from a {@link ChatInputCommandInteraction}. */
  execute(
    interaction: ChatInputCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Returns this command's options (arguments). */
  getOptions(): ReadonlyArray<CommandOptionData>;

  /** Returns the autocomplete options for the given interaction. */
  autocomplete(
    option: AutocompleteFocusedOption,
    interaction: AutocompleteInteraction,
    metadata: CommandExecutionMeta,
    respond: (options: ApplicationCommandOptionChoiceData[]) => Awaitable<void>,
  ): Awaitable<ReadonlyArray<ApplicationCommandOptionChoiceData>>;

  /** Handle a Interaction whose customId refers to this object. */
  handleInteraction(
    _interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
