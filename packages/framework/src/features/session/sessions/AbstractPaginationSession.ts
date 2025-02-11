import type {
  NyxBot,
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
  protected currentPage: number;

  constructor(options: {
    bot: NyxBot;
    id: string;
    startInteraction: SessionStartInteraction;
    ttl?: number;
  }) {
    super(options);
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

  public buildPageCustomId(page: number, extra?: string): string {
    return this.codec.serialize({
      ...this.customIdData,
      page,
      extra: extra ?? null,
    });
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
    return codec.deserialize(interaction.customId)?.page ?? null;
  }

  /** Extracts the referred page in an AnySelectMenuInteraction, if any. */
  protected extractPageFromSelectMenu(
    interaction: AnySelectMenuInteraction,
  ): number | null {
    const newPage = this.extractPageFromCustomId(interaction.customId);
    if (newPage !== null || !interaction.isStringSelectMenu()) {
      return newPage;
    }

    const firstValue = interaction.values[0];
    if (!firstValue || interaction.values.length > 1) {
      return newPage;
    }

    return this.extractPageFromCustomId(firstValue);
  }

  /** Extracts the referred page in an ModalMessageModalSubmitInteraction, if any. */
  protected extractPageFromModal(
    interaction: ModalMessageModalSubmitInteraction,
  ): number | null {
    const codec = this.bot.getSessionManager().getCustomIdCodec();

    const newPage = this.extractPageFromCustomId(interaction.customId);
    if (newPage !== null) return newPage;

    const components = interaction.components.flatMap((row) => row.components);
    for (const component of components) {
      const data = codec.deserialize(component.customId);
      if (!data) continue;

      const pageString = component.value;
      const pageNumber = parseInt(pageString);

      if (isNaN(pageNumber)) continue;

      return pageNumber;
    }

    return null;
  }

  /** Utility to build a pagination ActionRow, considering next/previous pages and disabling buttons accordingly. */
  protected buildBasicPageRow(
    hasNextPage?: boolean,
  ): ActionRowData<InteractionButtonComponentData> {
    const nextPage = this.currentPage + 1;
    const previousPage = this.currentPage - 1;

    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          customId: this.buildPageCustomId(previousPage),
          emoji: '⬅',
          style: ButtonStyle.Secondary,
          disabled: this.currentPage === 0,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Secondary,
          customId: hasNextPage ? this.buildPageCustomId(nextPage) : 'NaN',
          emoji: '➡',
          disabled: !hasNextPage,
        },
      ],
    };
  }

  protected extractPageFromCustomId(customId: string): number | null {
    return this.codec.deserialize(customId)?.page ?? null;
  }

  /** Handles a page update. */
  protected abstract updatePage(
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ): Promise<boolean>;
}
