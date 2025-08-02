import { MetaCollection, TypedFields } from '@nyx-discord/core';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import { AbstractDJSClientSubscriber as Subscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultCommandAutocompleteSubscriber extends Subscriber<Events.InteractionCreate> {
  protected override readonly event = Events.InteractionCreate;

  public async handleEvent(
    meta: MetaCollection,
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
