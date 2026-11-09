import {
  ApplicationCommandOptionType,
  type APIApplicationCommandNumberOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a number (floating point) option. */
export const number = <
  const Def extends DefOf<APIApplicationCommandNumberOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Number);
