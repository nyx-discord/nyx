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
  AnyExecutableCommand,
  ApplicationCommandInteraction,
  CommandRepository,
  CommandResolver,
} from '@nyx-discord/core';
import type { AutocompleteInteraction } from 'discord.js';

export class DefaultCommandResolver implements CommandResolver {
  public static create(): CommandResolver {
    return new DefaultCommandResolver();
  }

  public resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction | AutocompleteInteraction,
    repository: CommandRepository,
  ): AnyExecutableCommand | null {
    const { commandName } = interaction;
    if (!interaction.isChatInputCommand()) {
      return this.findTopLevelExecutable(commandName, repository);
    }

    const group = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand(false);

    if (!group && !subcommand) {
      return this.findTopLevelExecutable(commandName, repository);
    }

    if (group) {
      if (!subcommand) return null;
      return repository.locateByNameTree(commandName, group, subcommand);
    }

    if (subcommand) {
      const found = repository.locateByNameTree(commandName, subcommand);
      if (!found || found.isSubCommandGroup()) return null;
      return found;
    }

    return this.findTopLevelExecutable(commandName, repository);
  }

  public resolveFromAutocompleteInteraction(
    interaction: AutocompleteInteraction,
    repository: CommandRepository,
  ) {
    return this.resolveFromCommandInteraction(interaction, repository);
  }

  protected findTopLevelExecutable(
    commandName: string,
    repository: CommandRepository,
  ): AnyExecutableCommand | null {
    const found = repository.locateByNameTree(commandName);
    if (!found || found.isParent()) return null;
    return found;
  }
}
