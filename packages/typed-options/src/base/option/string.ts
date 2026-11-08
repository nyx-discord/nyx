import {
  ApplicationCommandOptionType,
  type APIApplicationCommandStringOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a string option. */
export const string = <
  const Def extends DefOf<APIApplicationCommandStringOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.String);
