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
    this.customId = bot
      .getSessionManager()
      .getCustomIdCodec()
      .createPageCustomIdBuilder(this);
    this.currentPage = 0;
  }

  public override async onUpdate(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean> {
    const newPage = this.extractPageFromInteraction(interaction);

    /** Not a page switch interaction, handle as normal. */
    if (newPage === null) {
      return super.onUpdate(interaction, meta);
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

  /** Extracts the referred page in an update interaction, if any. */
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

  /** Extracts the referred page in a ButtonInteraction, if any. */
  protected extractPageFromButton(
    interaction: ButtonInteraction,
  ): number | null {
    const codec = this.bot.getSessionManager().getCustomIdCodec();

    return codec.extractPageFromCustomId(interaction.customId);
  }

  /** Extracts the referred page in an AnySelectMenuInteraction, if any. */
  protected extractPageFromSelectMenu(
    interaction: AnySelectMenuInteraction,
  ): number | null {
    const codec = this.bot.getSessionManager().getCustomIdCodec();

    const newPage = codec.extractPageFromCustomId(interaction.customId);

    if (newPage !== null || !interaction.isStringSelectMenu()) return newPage;

    const firstValue = interaction.values[0];
    if (!firstValue || interaction.values.length > 1) return newPage;

    return codec.extractPageFromCustomId(firstValue);
  }

  /** Extracts the referred page in an ModalMessageModalSubmitInteraction, if any. */
  protected extractPageFromModal(
    interaction: ModalMessageModalSubmitInteraction,
  ): number | null {
    const codec = this.bot.getSessionManager().getCustomIdCodec();

    const newPage = codec.extractPageFromCustomId(interaction.customId);
    if (newPage !== null) return newPage;

    const components = interaction.components.flatMap((row) => row.components);
    for (const component of components) {
      const id = codec.deserializeToObjectId(component.customId);
      if (!id) continue;

      const pageString = component.value;
      const pageNumber = parseInt(pageString);

      if (isNaN(pageNumber)) continue;

      return pageNumber;
    }

    return null;
  }

  /** Utility to build a pagination ActionRow, considering next/previous pages and disabling buttons accordingly. */
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
          customId: hasNextPage ? this.buildCustomIdForPage(nextPage) : 'NaN',
          emoji: '➡',
          disabled: !hasNextPage,
        },
      ],
    };
  }

  /** Builds a customId for a given page. */
  protected buildCustomIdForPage(page: number): string {
    return this.customId.clone().setPage(page).build();
  }

  /** Handles a page update. */
  protected abstract updatePage(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean>;
}
