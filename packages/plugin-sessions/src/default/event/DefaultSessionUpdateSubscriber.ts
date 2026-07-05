import {
  AbstractDJSClientSubscriber as Subscriber,
  type Metadata,
  TypedFields,
} from '@nyx-discord/framework';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import { SessionPlugin } from '../SessionPlugin';

export class DefaultSessionUpdateSubscriber extends Subscriber<Events.InteractionCreate> {
  protected readonly event = Events.InteractionCreate;

  protected override protected = true;

  public async handleEvent(
    meta: Metadata,
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
    const handled = await bot
      .getPluginManager()
      .getPluginByClass(SessionPlugin, true)
      .update(interaction);
    if (handled) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
