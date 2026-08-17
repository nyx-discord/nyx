import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import type {
  APIActionRowComponent,
  APIButtonComponent,
} from 'discord-api-types/v10';
import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { PaginationSession } from './PaginationSession.js';
import { BaseSession } from './BaseSession.js';
import type { SessionOptions } from './SessionOptions.js';

export abstract class BasePaginationSession<
  Result,
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseSession<Result, Types>
  implements PaginationSession<Result, Types>
{
  protected currentPage: number;

  constructor(options: SessionOptions<Types>) {
    super(options);
    this.currentPage = 0;
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

  public buildPageCustomId(page: number, extra?: string): string {
    return this.codec.serialize({
      ...this.customIdData,
      page,
      extra: extra ?? null,
    });
  }

  /** Extracts the referred page in a customId, if any. */
  protected extractPageFromCustomId(customId: string): number | null {
    return this.codec.deserialize(customId)?.page ?? null;
  }

  /** Utility to build a pagination ActionRow, considering next/previous pages and disabling buttons accordingly. */
  protected buildBasicPageRow(
    hasNextPage?: boolean,
  ): APIActionRowComponent<APIButtonComponent> {
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
          custom_id: hasNextPage ? this.buildPageCustomId(nextPage) : 'NaN',
          emoji: { name: '➡' },
          disabled: !hasNextPage,
        },
      ],
    };
  }

  /** Handles a page update. */
  protected abstract updatePage(
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ): Promise<boolean>;
}
