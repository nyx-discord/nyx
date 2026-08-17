import type {
  CoreInteractionContext,
  CoreInteractionTypes,
} from '@nyx-discord/djs-core';
import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import { ComponentType, InteractionType } from 'discord-api-types/v10';
import type { Metadata } from '@nyx-discord/types';
import type { SessionInteractionInfo } from '../../shared/interaction/SessionInteractionInfo.js';
import type { SessionUpdateInteraction } from '../../shared/interaction/SessionUpdateInteraction.js';
import { BaseSession } from '../../shared/session/BaseSession.js';

export abstract class AbstractSession<Result = void> extends BaseSession<
  Result,
  CoreInteractionTypes
> {
  public override async onUpdate(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    const data = interaction.data;

    if (data.type === InteractionType.ModalSubmit) {
      return this.handleModal(
        interaction as CoreInteractionContext<APIModalSubmitInteraction>,
        meta,
      );
    }
    if (data.data.component_type === ComponentType.Button) {
      return this.handleButton(
        interaction as CoreInteractionContext<APIMessageComponentButtonInteraction>,
        meta,
      );
    }
    return this.handleSelectMenu(
      interaction as CoreInteractionContext<APIMessageComponentSelectMenuInteraction>,
      meta,
    );
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
}
