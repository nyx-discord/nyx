import type { ToEventProps } from '@discordjs/core';
import { GatewayDispatchEvents } from '@discordjs/core';
import type { Metadata } from '@nyx-discord/base';
import { TypedFields } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { AbstractCoreClientSubscriber } from '@nyx-discord/djs-core';
import type { APIInteraction } from '@discordjs/core';
import { InteractionType } from '@discordjs/core';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction';
import { CoreSessionPlugin } from '../plugin/CoreSessionPlugin.js';

// eslint-disable-next-line max-len
export class DefaultSessionUpdateSubscriber extends AbstractCoreClientSubscriber<GatewayDispatchEvents.InteractionCreate> {
  protected override readonly event = GatewayDispatchEvents.InteractionCreate;

  protected override protected = true;

  public async handleEvent(
    meta: Metadata,
    payload: ToEventProps<APIInteraction>,
  ): Promise<void> {
    const data = payload.data;

    if (
      data.type === InteractionType.ApplicationCommandAutocomplete
      || data.type === InteractionType.ApplicationCommand
      || (data.type === InteractionType.ModalSubmit && !('message' in data))
    ) {
      return;
    }

    const bot = TypedFields.Bot.get(meta, true);
    const handled = await bot
      .getPluginManager()
      .getPluginByClass(CoreSessionPlugin, true)
      .update(
        {
          data,
          api: payload.api,
        } as SessionUpdateInteraction<CoreInteractionTypes>,
        { ...meta },
      );
    if (handled) {
      TypedFields.EventHandled.set(meta, true);
    }
  }
}
