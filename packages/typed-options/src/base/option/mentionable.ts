import {
  ApplicationCommandOptionType,
  type APIApplicationCommandMentionableOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines a mentionable option (a user, member or role). */
export const mentionable = <
  const Def extends DefOf<APIApplicationCommandMentionableOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Mentionable);
