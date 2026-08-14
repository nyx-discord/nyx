import type { Metadata } from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import { AbstractDJSClientSubscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultCommandInteractionSubscriber extends AbstractDJSClientSubscriber<Events.InteractionCreate> {
  protected override readonly event = Events.InteractionCreate;

  public async handleEvent(
    meta: Metadata,
    interaction: Interaction,
  ): Promise<void> {
    if (
      interaction.isAutocomplete()
      || interaction.isPrimaryEntryPointCommand()
    ) {
      return;
    }

    const bot = TypedFields.Bot.get(meta, true);

    const handled = await bot.getCommandManager().execute(interaction);

    if (handled || interaction.replied) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
