import { BaseStandaloneCommand } from '@nyx-discord/base';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type { DjsComponentInteraction } from '../../../types/DjsComponentInteraction.js';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

export abstract class AbstractStandaloneCommand extends BaseStandaloneCommand<DjsInteractionTypes> {
  public handleInteraction(
    interaction: DjsComponentInteraction,
    metadata: Metadata,
  ): Awaitable<void> {
    if (interaction.isButton()) {
      return this.handleButton(interaction, metadata);
    }
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, metadata);
    }
    return this.handleSelectMenu(interaction, metadata);
  }
}
