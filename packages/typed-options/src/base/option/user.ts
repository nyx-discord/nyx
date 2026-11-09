import {
  ApplicationCommandOptionType,
  type APIApplicationCommandUserOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a user option. */
export const user = <const Def extends DefOf<APIApplicationCommandUserOption>>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.User);
