// Client events with @discordjs/core: subscribe to GatewayDispatchEvents; handlers receive ToEventProps<payload>.
// Docs: https://nyx-discord.github.io/nyx/guide/use/events.md
import { GatewayDispatchEvents, type APIInteraction, type ToEventProps } from '@discordjs/core';
import { AbstractCoreClientSubscriber, type Metadata } from '@nyx-discord/djs-core';

// Register with bot.subscribeToClient(new InteractionLogger()).
export class InteractionLogger extends AbstractCoreClientSubscriber<GatewayDispatchEvents.InteractionCreate> {
  protected readonly event = GatewayDispatchEvents.InteractionCreate;

  public async handleEvent(_meta: Metadata, payload: ToEventProps<APIInteraction>) {
    console.log(`Interaction ${payload.data.id} of type ${payload.data.type}`);
  }
}
