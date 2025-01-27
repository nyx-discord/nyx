import type { EventDispatchMeta } from '@nyx-discord/core';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';

import { AbstractDJSClientSubscriber as Subscriber } from '../../event/subscriber/AbstractDJSClientSubscriber.js';

export class DefaultSessionUpdateSubscriber extends Subscriber<Events.InteractionCreate> {
  protected readonly event = Events.InteractionCreate;

  protected override locked = true;

  public async handleEvent(
    meta: EventDispatchMeta,
    interaction: Interaction,
  ): Promise<void> {
    if (
      interaction.isAutocomplete()
      || interaction.isCommand()
      || (interaction.isModalSubmit() && !interaction.isFromMessage())
    ) {
      return;
    }

    const bot = meta.getBot(true);
    const handled = await bot.getSessionManager().update(interaction);
    if (handled) meta.setHandled();
  }
}
