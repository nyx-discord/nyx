import type { EventDispatcher } from './EventDispatcher.js';

export interface SyncEventDispatcher extends EventDispatcher {
  /**
   * Sets the maximum sync execution time of a subscriber.
   *
   * If this time is reached and the subscriber's execution still hasn't
   * finished, the subscriber's execution is moved to parallel and the next
   * subscriber is called.
   *
   * Useful for avoiding long sync subscribers blocking the event loop.
   * Setting it to `null` turns off this behavior.
   */
  setSyncTimeout(timeout: number | null): this;

  /**
   * Sets the maximum sync execution time of a subscriber.
   *
   * See {@link SyncEventDispatcher#setSyncTimeout}.
   */
  getSyncTimeout(): number | null;
}
