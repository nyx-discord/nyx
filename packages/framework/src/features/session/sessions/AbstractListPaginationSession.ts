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
