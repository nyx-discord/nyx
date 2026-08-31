import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { Metadata } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';
import type { SessionInteractionInfo } from '../../shared/types/interaction/SessionInteractionInfo.js';
import { BaseSession } from '../../shared/base/session/BaseSession.js';

export abstract class AbstractSession<Result = void> extends BaseSession<
  Result,
  DjsInteractionTypes
> {
  public override async onUpdate(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    if (interaction.isButton()) return this.handleButton(interaction, meta);
    if (interaction.isModalSubmit()) return this.handleModal(interaction, meta);
    return this.handleSelectMenu(interaction, meta);
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
