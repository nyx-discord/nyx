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
  ApplicationCommandInteraction,
  CommandReferenceData,
  CommandResolver,
} from '@nyx-discord/core';
import { ResolvedCommandType } from '@nyx-discord/core';
import type { AutocompleteInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord.js';

export class DefaultCommandResolver implements CommandResolver {
  public static create(): CommandResolver {
    return new DefaultCommandResolver();
  }

  public resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction | AutocompleteInteraction,
  ): CommandReferenceData | null {
    const { commandName } = interaction;
    if (interaction.commandType !== ApplicationCommandType.ChatInput) {
      return {
        type: ResolvedCommandType.StandaloneCommand,
        root: commandName,
        commandType: interaction.commandType,
      };
    }

    const subCommandName = interaction.options.getSubcommand(false);
    const groupName = interaction.options.getSubcommandGroup(false);

    if (!subCommandName && !groupName) {
      return {
        type: ResolvedCommandType.StandaloneCommand,
        root: commandName,
        commandType: interaction.commandType,
      };
    }

    if (!groupName && subCommandName) {
      return {
        type: ResolvedCommandType.SubCommand,
        root: commandName,
        subCommand: subCommandName,
      };
    }

    if (groupName && subCommandName) {
      return {
        type: ResolvedCommandType.SubCommandOnGroup,
        root: commandName,
        subCommand: subCommandName,
        group: groupName,
      };
    }

    return null;
  }

  public resolveFromAutocompleteInteraction(
    interaction: AutocompleteInteraction,
  ) {
    return this.resolveFromCommandInteraction(interaction);
  }
}
