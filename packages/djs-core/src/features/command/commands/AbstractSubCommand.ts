import type { ToEventProps } from '@discordjs/core';
import { BaseSubCommand } from '@nyx-discord/base';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import { ComponentType, InteractionType } from 'discord-api-types/v10';
import type { CoreComponentInteraction } from '../../../types/CoreComponentInteraction.js';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

export abstract class AbstractSubCommand extends BaseSubCommand<CoreInteractionTypes> {
  public handleInteraction(
    ctx: CoreComponentInteraction,
    metadata: Metadata,
  ): Awaitable<void> {
    const interaction = ctx.data;
    if (interaction.type === InteractionType.ModalSubmit) {
      return this.handleModal(
        ctx as ToEventProps<APIModalSubmitInteraction>,
        metadata,
      );
    }
    if (interaction.data.component_type === ComponentType.Button) {
      return this.handleButton(
        ctx as ToEventProps<APIMessageComponentButtonInteraction>,
        metadata,
      );
    }
    return this.handleSelectMenu(
      ctx as ToEventProps<APIMessageComponentSelectMenuInteraction>,
      metadata,
    );
  }
}
