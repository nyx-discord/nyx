import type { ToEventProps } from '@discordjs/core';
import type { Metadata } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
} from '@discordjs/core';
import { ComponentType, InteractionType } from '@discordjs/core';
import { BaseSessionStage } from '../../shared/base/session/stage/BaseSessionStage.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';

export abstract class AbstractSessionStage<
  Result = void,
> extends BaseSessionStage<Result, CoreInteractionTypes> {
  public override async update(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
    meta: Metadata,
  ): Promise<boolean> {
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
    return this.handleSelect(
      interaction as ToEventProps<APIMessageComponentSelectMenuInteraction>,
      meta,
    );
  }
}
