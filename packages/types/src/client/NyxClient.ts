import type { EventEmitterLike } from '../features/event/emitter/EventEmitterLike.js';

/** A minimal abstraction over a Discord client backend. */
export interface NyxClient<
  Emitter extends EventEmitterLike = EventEmitterLike,
> {
  /** Returns the raw event emitter of this client, used to back client event buses. */
  getEmitter(): Emitter;

  /** Logs the client in, starting the gateway connection. */
  login(): Promise<void>;

  /** Destroys the client's connection. */
  destroy(): Promise<void>;
}
