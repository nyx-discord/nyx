import {
  ApplicationCommandOptionType,
  type APIApplicationCommandBooleanOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a boolean option. */
export const boolean = <
  const Def extends DefOf<APIApplicationCommandBooleanOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Boolean);
