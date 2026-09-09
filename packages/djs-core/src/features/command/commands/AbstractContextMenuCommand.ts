import type {
  APIContextMenuInteraction,
  APIMessageApplicationCommandInteraction,
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
  APIUserApplicationCommandInteraction,
  ToEventProps,
} from '@discordjs/core';
import {
  ApplicationCommandType,
  ComponentType,
  InteractionType,
} from '@discordjs/core';
import { BaseContextMenuCommand } from '@nyx-discord/base';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type { CoreComponentInteraction } from '../../../types/CoreComponentInteraction.js';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

export abstract class AbstractContextMenuCommand extends BaseContextMenuCommand<CoreInteractionTypes> {
  public execute(
    ctx: ToEventProps<APIContextMenuInteraction>,
    metadata: Metadata,
  ): Awaitable<void> {
    const interaction = ctx.data;
    if (interaction.data.type === ApplicationCommandType.Message) {
      return this.executeMessage(
        ctx as ToEventProps<APIMessageApplicationCommandInteraction>,
        metadata,
      );
    }
    if (interaction.data.type === ApplicationCommandType.User) {
      return this.executeUser(
        ctx as ToEventProps<APIUserApplicationCommandInteraction>,
        metadata,
      );
    }
  }

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
