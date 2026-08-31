import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { Metadata } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';
import { BaseSessionStage } from '../../shared/base/session/stage/BaseSessionStage.js';

export abstract class AbstractSessionStage<
  Result = void,
> extends BaseSessionStage<Result, DjsInteractionTypes> {
  public override async update(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
    if (interaction.isButton()) return this.handleButton(interaction, meta);
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, meta);
    }
    return this.handleSelect(interaction, meta);
  }
}
