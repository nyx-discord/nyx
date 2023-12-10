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
  CommandData,
  CommandExecutionMeta,
  CommandFilter,
  CommandOptionData,
  ComponentCommandInteraction,
  CustomIdBuilder,
  ExecutableCommand,
  NyxBot,
} from '@nyx-discord/core';
import type {
  AnySelectMenuInteraction,
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  Awaitable,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

import { NotImplementedError } from '../../../../errors/NotImplementedError.js';
import { AbstractCommand } from './AbstractCommand.js';

/** A command that can be executed (called) by an interaction. */
export abstract class AbstractExecutableCommand<Data extends CommandData>
  extends AbstractCommand<Data>
  implements ExecutableCommand<Data>
{
  protected readonly filter: CommandFilter<Data> | null = null;

  protected options: CommandOptionData[] = [];

  public getOptions(): ReadonlyArray<CommandOptionData> {
    return this.options;
  }

  public autocomplete(
    _option: AutocompleteFocusedOption,
    _interaction: AutocompleteInteraction,
    _metadata: CommandExecutionMeta,
    _respond: (
      options: ApplicationCommandOptionChoiceData[],
    ) => Awaitable<void>,
  ): Awaitable<ApplicationCommandOptionChoiceData[]> {
    return [];
  }

  public async handleInteraction(
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Promise<void> {
    if (interaction.isButton()) return this.handleButton(interaction, metadata);
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, metadata);
    }
    return this.handleSelectMenu(interaction, metadata);
  }

  public getFilter(): CommandFilter<Data> | null {
    return this.filter;
  }

  public override isExecutable(): this is ExecutableCommand<Data> {
    return true;
  }

  protected handleButton(
    _interaction: ButtonInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  protected getCustomIdBuilder(bot: NyxBot): CustomIdBuilder {
    return bot.commands.getCustomIdCodec().createCustomIdBuilder(this);
  }

  protected getCustomId(bot: NyxBot): string {
    return bot.commands.getCustomIdCodec().serializeToCustomId(this);
  }

  public abstract execute(
    interaction: ChatInputCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
