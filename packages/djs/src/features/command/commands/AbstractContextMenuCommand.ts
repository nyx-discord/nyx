import { BaseContextMenuCommand } from '@nyx-discord/base';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type { ContextMenuCommandInteraction } from 'discord.js';
import type { DjsComponentInteraction } from '../../../types/DjsComponentInteraction.js';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

export abstract class AbstractContextMenuCommand extends BaseContextMenuCommand<DjsInteractionTypes> {
  public execute(
    interaction: ContextMenuCommandInteraction,
    metadata: Metadata,
  ): Awaitable<void> {
    if (interaction.isMessageContextMenuCommand()) {
      return this.executeMessage(interaction, metadata);
    }
    if (interaction.isUserContextMenuCommand()) {
      return this.executeUser(interaction, metadata);
    }
  }

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
