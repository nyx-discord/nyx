import { type MetaCollection, TypedFields } from '@nyx-discord/core';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import { AbstractDJSClientSubscriber as Subscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultSessionUpdateSubscriber extends Subscriber<Events.InteractionCreate> {
  protected readonly event = Events.InteractionCreate;

  protected override protected = true;

  public async handleEvent(
    meta: MetaCollection,
    interaction: Interaction,
  ): Promise<void> {
    if (
      interaction.isAutocomplete()
      || interaction.isCommand()
      || (interaction.isModalSubmit() && !interaction.isFromMessage())
    ) {
      return;
    }

    const bot = TypedFields.Bot.get(meta, true);
    const handled = await bot.getSessionManager().update(interaction);
    if (handled) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
