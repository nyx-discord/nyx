import type { Metadata } from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import { AbstractDJSClientSubscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultCommandAutocompleteSubscriber extends AbstractDJSClientSubscriber<Events.InteractionCreate> {
  protected override readonly event = Events.InteractionCreate;

  public async handleEvent(
    meta: Metadata,
    interaction: Interaction,
  ): Promise<void> {
    if (!interaction.isAutocomplete()) return;
    const bot = TypedFields.Bot.get(meta, true);

    const handled = await bot.getCommandManager().autocomplete(interaction);

    if (handled || interaction.responded) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
