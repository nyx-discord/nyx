import type { ToEventProps } from '@discordjs/core';
import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { Metadata } from '@nyx-discord/types';
import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import { ComponentType, InteractionType } from 'discord-api-types/v10';
import type { SessionInteractionInfo } from '../../shared/types/interaction/SessionInteractionInfo.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction.js';
import { BasePaginationSession } from '../../shared/base/session/BasePaginationSession.js';

export abstract class AbstractPaginationSession<
  Result = void,
> extends BasePaginationSession<Result, CoreInteractionTypes> {
  public override async onUpdate(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    const newPage = this.extractPageFromInteraction(interaction);

    /** Not a page switch interaction, handle as normal. */
    if (newPage === null) {
      const data = interaction.data;
      if (data.type === InteractionType.ModalSubmit) {
        return this.handleModal(
          interaction as ToEventProps<APIModalSubmitInteraction>,
          meta,
        );
      }
      if (data.data.component_type === ComponentType.Button) {
        return this.handleButton(
          interaction as ToEventProps<APIMessageComponentButtonInteraction>,
          meta,
        );
      }
      return this.handleSelectMenu(
        interaction as ToEventProps<APIMessageComponentSelectMenuInteraction>,
        meta,
      );
    }

    /** Switch page interaction. */
    this.currentPage = newPage;
    return this.updatePage(interaction, meta);
  }

  protected override getStartInteractionInfo(): SessionInteractionInfo {
    const data = this.startInteraction.data;
    return {
      userId: data.member?.user.id ?? data.user?.id ?? 'unknown',
      guildId: data.guild_id ?? null,
      channelId: data.channel_id ?? 'unknown',
      replied: false,
    };
  }

  /** Extracts the referred page in an update interaction, if any. */
  protected extractPageFromInteraction(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
  ): number | null {
    const data = interaction.data;

    if (data.type === InteractionType.ModalSubmit) {
      return this.extractPageFromModal(
        interaction as ToEventProps<APIModalSubmitInteraction>,
      );
    }
    if (data.data.component_type === ComponentType.Button) {
      return this.extractPageFromButton(
        interaction as ToEventProps<APIMessageComponentButtonInteraction>,
      );
    }
    return this.extractPageFromSelectMenu(
      interaction as ToEventProps<APIMessageComponentSelectMenuInteraction>,
    );
  }

  /** Extracts the referred page in a ButtonInteraction, if any. */
  protected extractPageFromButton(
    interaction: ToEventProps<APIMessageComponentButtonInteraction>,
  ): number | null {
    return (
      this.codec.deserialize(interaction.data.data.custom_id)?.page ?? null
    );
  }

  /** Extracts the referred page in a SelectMenuInteraction, if any. */
  protected extractPageFromSelectMenu(
    interaction: ToEventProps<APIMessageComponentSelectMenuInteraction>,
  ): number | null {
    const data = interaction.data.data;
    const newPage = this.extractPageFromCustomId(data.custom_id);
    if (
      newPage !== null
      || data.component_type !== ComponentType.StringSelect
    ) {
      return newPage;
    }

    const firstValue = data.values[0];
    if (!firstValue || data.values.length > 1) {
      return newPage;
    }

    return this.extractPageFromCustomId(firstValue);
  }

  /** Extracts the referred page in a ModalSubmitInteraction, if any. */
  protected extractPageFromModal(
    interaction: ToEventProps<APIModalSubmitInteraction>,
  ): number | null {
    const data = interaction.data.data;
    const newPage = this.extractPageFromCustomId(data.custom_id);
    if (newPage !== null) return newPage;

    for (const component of data.components) {
      if (component.type !== ComponentType.ActionRow) continue;

      for (const rowComponent of component.components) {
        const customIdData = this.codec.deserialize(rowComponent.custom_id);
        if (!customIdData) continue;

        const pageNumber = parseInt(rowComponent.value);

        if (isNaN(pageNumber)) continue;

        return pageNumber;
      }
    }

    return null;
  }
}
