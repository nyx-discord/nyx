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
  ApplicationCommandInteraction,
  CommandExecutionMeta,
  CommandFilter,
  ComponentCommandInteraction,
  CustomIdBuilder,
  ExecutableCommand,
  NyxBot,
} from '@nyx-discord/core';
import type {
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

import { NotImplementedError } from '../../../../errors/NotImplementedError';
import { AbstractCommand } from '../AbstractCommand';

export abstract class AbstractExecutableCommand<
    Data,
    Interaction extends ApplicationCommandInteraction,
  >
  extends AbstractCommand<Data>
  implements ExecutableCommand<Data, Interaction>
{
  protected readonly filter: CommandFilter | null = null;

  public handleInteraction(
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    if (interaction.isButton()) return this.handleButton(interaction, metadata);
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, metadata);
    }
    return this.handleSelectMenu(interaction, metadata);
  }

  public getFilter(): CommandFilter | null {
    return this.filter;
  }

  public abstract execute(
    interaction: Interaction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Handles a {@link ButtonInteraction} whose customId matches this command. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this command. */
  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this command. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Returns this command's {@link CustomIdBuilder} on the given bot. */
  protected getCustomIdBuilder(bot: NyxBot): CustomIdBuilder {
    return bot.commands.getCustomIdCodec().createCustomIdBuilder(this);
  }

  /** Returns this command's customId on the given bot. */
  protected getCustomId(bot: NyxBot): string {
    return bot.commands.getCustomIdCodec().serializeToCustomId(this);
  }
}
