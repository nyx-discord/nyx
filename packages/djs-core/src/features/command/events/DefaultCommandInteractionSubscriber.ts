import type {
  CommandExecutableInteraction,
  Metadata,
} from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import { GatewayDispatchEvents } from '@discordjs/core';
import type { ToEventProps } from '@discordjs/core';
import type { APIInteraction } from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import { AbstractCoreClientSubscriber } from '../../event/subscriber/AbstractCoreClientSubscriber.js';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

export class DefaultCommandInteractionSubscriber extends AbstractCoreClientSubscriber<GatewayDispatchEvents.InteractionCreate> {
  protected override readonly event = GatewayDispatchEvents.InteractionCreate;

  public async handleEvent(
    meta: Metadata,
    payload: ToEventProps<APIInteraction>,
  ): Promise<void> {
    if (payload.data.type === InteractionType.ApplicationCommandAutocomplete) {
      return;
    }

    const bot = TypedFields.Bot.get(meta, true);

    const handled = await bot.getCommandManager().execute({
      data: payload.data,
      api: payload.api,
    } as CommandExecutableInteraction<CoreInteractionTypes>);

    if (handled) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
