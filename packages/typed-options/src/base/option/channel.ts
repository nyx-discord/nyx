import {
  ApplicationCommandOptionType,
  type APIApplicationCommandChannelOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a channel option, narrowed by its `channel_types`. */
export const channel = <
  const Def extends DefOf<APIApplicationCommandChannelOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Channel);
