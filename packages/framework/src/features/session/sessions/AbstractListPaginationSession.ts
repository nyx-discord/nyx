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
  ListPaginationSession,
  NyxBot,
  SessionStartInteraction,
} from '@nyx-discord/core';
import type { ActionRowData, InteractionButtonComponentData } from 'discord.js';
import { ButtonStyle, ComponentType } from 'discord.js';
import { AbstractPaginationSession } from './AbstractPaginationSession.js';

export abstract class AbstractListPaginationSession<Item, Result>
  extends AbstractPaginationSession<Result>
  implements ListPaginationSession<Item, Result>
{
  public static readonly DefaultItemsPerPage = 10;

  protected readonly itemsPerPage: number;

  protected items: Item[];

  constructor(
    bot: NyxBot,
    id: string,
    createInteraction: SessionStartInteraction,
    items: Item[],
    itemsPerPage?: number,
    ttl?: number,
  ) {
    super(bot, id, createInteraction, ttl);
    this.itemsPerPage =
      itemsPerPage ?? AbstractListPaginationSession.DefaultItemsPerPage;
    this.items = items;
  }

  public getItemsPerPage(): number {
    return this.itemsPerPage;
  }

  public getCurrentPageItems(): ReadonlyArray<Item> {
    return this.items.slice(
      this.currentPage * this.itemsPerPage,
      this.currentPage * this.itemsPerPage + this.itemsPerPage,
    );
  }

  protected override buildDefaultPageRow(): ActionRowData<InteractionButtonComponentData> {
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
          customId: this.buildCustomIdForPage(nextPage),
          emoji: '➡',
          disabled: this.itemsPerPage * nextPage >= this.items.length,
        },
      ],
    };
  }
}
