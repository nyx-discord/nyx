import {
  ApplicationCommandOptionType,
  type APIApplicationCommandIntegerOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines an integer option. */
export const integer = <
  const Def extends DefOf<APIApplicationCommandIntegerOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Integer);
