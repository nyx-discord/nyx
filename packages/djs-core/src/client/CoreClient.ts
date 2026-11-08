import type { API } from '@discordjs/core';
import type { EventEmitterLike, NyxClient } from '@nyx-discord/base';

/** A {@link NyxClient} that @discordjs/core bots can use, whether interactions arrive through the gateway or another transport. */
export interface CoreClient<
  Emitter extends EventEmitterLike = EventEmitterLike,
> extends NyxClient<Emitter> {
  /** Returns the @discordjs/core REST API. */
  getApi(): API;

  /** Returns the bot's application ID. */
  getApplicationId(): string;
}
