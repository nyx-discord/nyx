import type { EventEmitterLike } from '@nyx-discord/djs-core';

/** An event emitter whose `emit()` returns when its listeners' work is done, so a request knows when its handlers finished. */
export interface AwaitableEventEmitter<
  Events extends Record<keyof Events, unknown[]>,
> extends EventEmitterLike {
  /** Registers a listener for an event. */
  on<Event extends keyof Events & string>(
    event: Event,
    listener: (...args: Events[Event]) => unknown,
  ): this;

  /** Removes a listener from an event. */
  off<Event extends keyof Events & string>(
    event: Event,
    listener: (...args: Events[Event]) => unknown,
  ): this;

  /** Removes every listener of an event, or of every event if none is given. */
  removeAllListeners(event?: keyof Events & string): this;

  /**
   * Calls every listener of an event synchronously, in the order they were registered.
   *
   * @returns {Promise<void>} A promise that settles once every promise returned by the listeners settles. It never rejects.
   */
  emit<Event extends keyof Events & string>(
    event: Event,
    ...args: Events[Event]
  ): Promise<void>;
}
