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
import type { SessionUpdateInteraction } from '../../shared/interaction/SessionUpdateInteraction.js';
import { BaseSessionStage } from '../../shared/session/stage/BaseSessionStage.js';

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
    return this.handleSelect(
      interaction as CoreInteractionContext<APIMessageComponentSelectMenuInteraction>,
      meta,
    );
  }
}
