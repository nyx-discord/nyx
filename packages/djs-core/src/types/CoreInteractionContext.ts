import type { API } from '@discordjs/core';

/** The interaction context passed to command handlers when using @discordjs/core. */
export interface CoreInteractionContext<T = unknown> {
  /** The raw interaction data from the gateway event. */
  data: T;
  /** The REST API used to respond to the interaction. */
  api: API;
}
