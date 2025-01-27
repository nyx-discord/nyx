import type { Awaitable, ClientEvents, Events } from 'discord.js';

import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver.js';
import type { EventSubscriber } from '../../event/subscriber/EventSubscriber.js';

/** An object that stores the current subscribers for a {@link CommandManager} */
export interface CommandSubscriptionsContainer extends BotLifecycleObserver {
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
