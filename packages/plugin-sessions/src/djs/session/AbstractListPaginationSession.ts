import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import type {
  APIActionRowComponent,
  APIButtonComponent,
} from 'discord-api-types/v10';
import type { ListPaginationSession } from '../../shared/session/ListPaginationSession.js';
import type { ListPaginationSessionOptions } from '../../shared/session/ListPaginationSessionOptions.js';
import { AbstractPaginationSession } from './AbstractPaginationSession.js';

export abstract class AbstractListPaginationSession<Item, Result = void>
  extends AbstractPaginationSession<Result>
  implements ListPaginationSession<Item, Result, DjsInteractionTypes>
{
  public static readonly DefaultItemsPerPage = 10;

  protected readonly itemsPerPage: number;

  protected items: Item[];

  constructor(
    options: ListPaginationSessionOptions<Item, DjsInteractionTypes>,
  ) {
    super(options);
    this.itemsPerPage =
      options.itemsPerPage ?? AbstractListPaginationSession.DefaultItemsPerPage;
    this.items = options.items;
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

  protected override buildBasicPageRow(): APIActionRowComponent<APIButtonComponent> {
    const nextPage = this.currentPage + 1;
    const previousPage = this.currentPage - 1;

    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          custom_id: this.buildPageCustomId(previousPage),
          emoji: { name: '⬅' },
          style: ButtonStyle.Secondary,
          disabled: this.currentPage === 0,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          custom_id: this.buildPageCustomId(nextPage),
          emoji: { name: '➡' },
          disabled: this.itemsPerPage * nextPage >= this.items.length,
        },
      ],
    };
  }
}
