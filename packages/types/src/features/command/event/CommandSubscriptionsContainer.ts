import type { Awaitable } from '../../../types/Awaitable.js';
import type { EventSubscriber } from '../../event/subscriber/EventSubscriber.js';

/** An object that stores the current subscribers for a {@link CommandManager} */
export interface CommandSubscriptionsContainer<
  ClientEventMap extends Record<keyof ClientEventMap & string, unknown[]> =
    Record<string, unknown[]>,
> {
  /** Subscribes this container's subscribers to the client. */
  subscribe(): Awaitable<void>;

  /** Unsubscribes this container's subscribers from the client. */
  unsubscribe(): Awaitable<void>;

  /** Returns the event subscriber for command interaction events. */
  getInteractionSubscriber(): EventSubscriber<
    ClientEventMap,
    keyof ClientEventMap & string
  >;

  /** Sets the event subscriber for command interaction events. */
  setInteractionSubscriber(
    subscriber: EventSubscriber<ClientEventMap, keyof ClientEventMap & string>,
  ): Awaitable<this>;

  /** Returns an event subscriber for autocomplete events. */
  getAutocompleteSubscriber(): EventSubscriber<
    ClientEventMap,
    keyof ClientEventMap & string
  >;

  /** Sets the event subscriber for autocomplete events. */
  setAutocompleteSubscriber(
    subscriber: EventSubscriber<ClientEventMap, keyof ClientEventMap & string>,
  ): Awaitable<this>;
}
