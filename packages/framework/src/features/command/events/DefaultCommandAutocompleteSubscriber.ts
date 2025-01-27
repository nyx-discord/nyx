import type { EventDispatchMeta } from '@nyx-discord/core';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';

import { AbstractDJSClientSubscriber as Subscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultCommandAutocompleteSubscriber extends Subscriber<Events.InteractionCreate> {
  protected override readonly event = Events.InteractionCreate;

  public async handleEvent(
    meta: EventDispatchMeta,
    interaction: Interaction,
  ): Promise<void> {
    if (!interaction.isAutocomplete()) return;

    const bot = meta.getBot(true);

    const handled: boolean = await bot
      .getCommandManager()
      .autocomplete(interaction);
    if (handled || interaction.responded) meta.setHandled();
  }
}
