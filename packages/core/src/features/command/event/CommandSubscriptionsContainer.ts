import type { Awaitable, ClientEvents, Events } from 'discord.js';
import type { EventSubscriber } from '../../event/subscriber/EventSubscriber.js';

/** An object that stores the current subscribers for a {@link CommandManager} */
export interface CommandSubscriptionsContainer {
  /** Subscribes this container's subscribers to the client. */
  subscribe(): Awaitable<void>;

  /** Unsubscribes this container's subscribers from the client. */
  unsubscribe(): Awaitable<void>;

  /** Returns the event subscriber for {@link CommandExecutableInteraction} events. */
  getInteractionSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  /** Sets the event subscriber for {@link CommandExecutableInteraction} events. */
  setInteractionSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Awaitable<this>;

  /** Returns an event subscriber for autocomplete events (interactionCreate). */
  getAutocompleteSubscriber(): EventSubscriber<
    ClientEvents,
    Events.InteractionCreate
  >;

  /** Sets the event subscriber for autocomplete events (interactionCreate). */
  setAutocompleteSubscriber(
    subscriber: EventSubscriber<ClientEvents, Events.InteractionCreate>,
  ): Awaitable<this>;
}
