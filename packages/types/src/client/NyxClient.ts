import type { EventEmitterLike } from '../features/event/emitter/EventEmitterLike.js';

/**
 * A minimal abstraction over a Discord client backend.
 *
 * Each adapter (e.g. `@nyx-discord/djs` for discord.js or `@nyx-discord/djs-core`
 * for @discordjs/core) provides a client wrapper that exposes the raw emitter
 * for event buses and the login/destroy lifecycle.
 */
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
