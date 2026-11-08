import {
  ApplicationCommandOptionType,
  type APIApplicationCommandRoleOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a role option. */
export const role = <const Def extends DefOf<APIApplicationCommandRoleOption>>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Role);
