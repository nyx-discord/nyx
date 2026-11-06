import type { Metadata } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { BaseStagePaginationSession } from '../../shared/base/session/stage/BaseStagePaginationSession.js';
import type { SessionInteractionInfo } from '../../shared/types/interaction/SessionInteractionInfo.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';

export abstract class AbstractStagePaginationSession<
  Result,
> extends BaseStagePaginationSession<Result, CoreInteractionTypes> {
  public override async onUpdate(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    const newPage = this.extractPageFromCustomId(
      interaction.data.data.custom_id,
    );

    return this.routeUpdate(newPage, interaction, meta);
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
