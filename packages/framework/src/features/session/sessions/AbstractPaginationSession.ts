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
  NyxBot,
  PaginationCustomIdBuilder,
  PaginationSession,
  SessionExecutionMeta,
  SessionStartInteraction,
  SessionUpdateInteraction,
} from '@nyx-discord/core';
import type {
  ActionRowData,
  AnySelectMenuInteraction,
  ButtonInteraction,
  InteractionButtonComponentData,
  ModalMessageModalSubmitInteraction,
} from 'discord.js';
import { ButtonStyle, ComponentType } from 'discord.js';

import { AbstractSession } from './AbstractSession.js';

export abstract class AbstractPaginationSession<Result>
  extends AbstractSession<Result>
  implements PaginationSession<Result>
{
  protected override customId: PaginationCustomIdBuilder;

  protected currentPage: number;

  constructor(
    bot: NyxBot,
    id: string,
    createInteraction: SessionStartInteraction,
    ttl?: number,
  ) {
    super(bot, id, createInteraction, ttl);
    this.customId = bot.sessions
      .getCustomIdCodec()
      .createPageCustomIdBuilder(this);
    this.currentPage = 0;
  }

  public override async update(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    const newPage = this.extractPageFromInteraction(interaction);

    /** Not a page switch interaction, handle as normal. */
    if (newPage === null) {
      return super.update(interaction, meta);
    }

    /** Switch page interaction. */
    this.currentPage = newPage;
    return this.updatePage(interaction, meta);
  }

  public getCurrentPage(): Readonly<number> {
    return this.currentPage;
  }

  public getNextPage(): number | null {
    return this.currentPage + 1;
  }

  public getPreviousPage(): number | null {
    return this.currentPage == 0 ? null : this.currentPage - 1;
  }

  protected extractPageFromInteraction(
    interaction: SessionUpdateInteraction,
  ): number | null {
    if (interaction.isButton()) {
      return this.extractPageFromButton(interaction);
    }

    if (interaction.isAnySelectMenu()) {
      return this.extractPageFromSelectMenu(interaction);
    }

    return this.extractPageFromModal(interaction);
  }

  protected extractPageFromButton(
    interaction: ButtonInteraction,
  ): number | null {
    const codec = this.bot.sessions.getCustomIdCodec();

    return codec.extractPageFromCustomId(interaction.customId);
  }

  protected extractPageFromSelectMenu(
    interaction: AnySelectMenuInteraction,
  ): number | null {
    const codec = this.bot.sessions.getCustomIdCodec();

    const newPage = codec.extractPageFromCustomId(interaction.customId);

    if (!newPage === null || !interaction.isStringSelectMenu()) return newPage;

    const firstValue = interaction.values[0];
    if (!firstValue || interaction.values.length > 1) return newPage;

    return codec.extractPageFromCustomId(firstValue);
  }

  protected extractPageFromModal(
    interaction: ModalMessageModalSubmitInteraction,
  ): number | null {
    const codec = this.bot.sessions.getCustomIdCodec();

    const newPage = codec.extractPageFromCustomId(interaction.customId);
    if (!newPage === null) return newPage;

    const components = interaction.components.flatMap((row) => row.components);
    for (const component of components) {
      const id = codec.deserializeToObjectId(component.customId);
      if (!id) continue;

      const pageString = component.value;
      const pageNumber = parseInt(pageString);

      if (isNaN(pageNumber)) continue;

      return pageNumber;
    }

    return newPage;
  }

  protected buildDefaultPageRow(
    hasNextPage?: boolean,
  ): ActionRowData<InteractionButtonComponentData> {
    const nextPage = this.currentPage + 1;
    const previousPage = this.currentPage - 1;

    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          customId: this.buildCustomIdForPage(previousPage),
          emoji: '⬅',
          style: ButtonStyle.Secondary,
          disabled: this.currentPage === 0,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          customId: hasNextPage
            ? this.buildCustomIdForPage(nextPage)
            : Math.random().toString(),
          emoji: '➡',
          disabled: !hasNextPage,
        },
      ],
    };
  }

  protected buildCustomIdForPage(page: number): string {
    return this.customId.clone().setPage(page).build();
  }

  protected abstract updatePage(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean>;
}
