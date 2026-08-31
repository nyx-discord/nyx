import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { Metadata } from '@nyx-discord/types';
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalMessageModalSubmitInteraction,
} from 'discord.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';
import type { SessionInteractionInfo } from '../../shared/types/interaction/SessionInteractionInfo.js';
import { BasePaginationSession } from '../../shared/base/session/BasePaginationSession.js';

export abstract class AbstractPaginationSession<
  Result = void,
> extends BasePaginationSession<Result, DjsInteractionTypes> {
  public override async onUpdate(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    const newPage = this.extractPageFromInteraction(interaction);

    /** Not a page switch interaction, handle as normal. */
    if (newPage === null) {
      if (interaction.isButton()) return this.handleButton(interaction, meta);
      if (interaction.isModalSubmit()) {
        return this.handleModal(interaction, meta);
      }
      return this.handleSelectMenu(interaction, meta);
    }

    /** Switch page interaction. */
    this.currentPage = newPage;
    return this.updatePage(interaction, meta);
  }

  protected override getStartInteractionInfo(): SessionInteractionInfo {
    const { startInteraction } = this;
    return {
      userId: startInteraction.user.id,
      guildId: startInteraction.guildId,
      channelId: startInteraction.channelId ?? 'unknown',
      replied: startInteraction.replied,
    };
  }

  /** Extracts the referred page in an update interaction, if any. */
  protected extractPageFromInteraction(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
  ): number | null {
    if (interaction.isButton()) {
      return this.extractPageFromButton(interaction);
    }

    if (interaction.isAnySelectMenu()) {
      return this.extractPageFromSelectMenu(interaction);
    }

    return this.extractPageFromModal(
      interaction as ModalMessageModalSubmitInteraction,
    );
  }

  /** Extracts the referred page in a ButtonInteraction, if any. */
  protected extractPageFromButton(
    interaction: ButtonInteraction,
  ): number | null {
    return this.codec.deserialize(interaction.customId)?.page ?? null;
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
    const newPage = this.extractPageFromCustomId(interaction.customId);
    if (newPage !== null) return newPage;

    const components = interaction.components.flatMap((row) => row.components);
    for (const component of components) {
      const data = this.codec.deserialize(component.customId);
      if (!data) continue;

      const pageString = component.value;
      const pageNumber = parseInt(pageString);

      if (isNaN(pageNumber)) continue;

      return pageNumber;
    }

    return null;
  }
}
