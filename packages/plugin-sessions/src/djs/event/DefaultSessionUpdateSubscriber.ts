import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { AbstractDJSClientSubscriber } from '@nyx-discord/djs';
import type { Metadata } from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import type { Interaction } from 'discord.js';
import { Events } from 'discord.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';
import { DjsSessionPlugin } from '../plugin/DjsSessionPlugin.js';

// eslint-disable-next-line max-len
export class DefaultSessionUpdateSubscriber extends AbstractDJSClientSubscriber<Events.InteractionCreate> {
  protected override readonly event = Events.InteractionCreate;

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
      .getPluginByClass(DjsSessionPlugin, true)
      .update(interaction as SessionUpdateInteraction<DjsInteractionTypes>);
    if (handled) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
