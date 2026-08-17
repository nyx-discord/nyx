import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { Metadata } from '@nyx-discord/types';
import type { SessionInteractionInfo } from '../../shared/interaction/SessionInteractionInfo.js';
import type { SessionUpdateInteraction } from '../../shared/interaction/SessionUpdateInteraction.js';
import { BaseStagePaginationSession } from '../../shared/session/stage/BaseStagePaginationSession.js';

export abstract class AbstractStagePaginationSession<
  Result,
> extends BaseStagePaginationSession<Result, DjsInteractionTypes> {
  public override async onUpdate(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    const newPage = this.extractPageFromCustomId(interaction.customId);

    return this.routeUpdate(newPage, interaction, meta);
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
}
