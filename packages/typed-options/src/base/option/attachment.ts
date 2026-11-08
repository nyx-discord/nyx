import {
  ApplicationCommandOptionType,
  type APIApplicationCommandAttachmentOption,
} from 'discord-api-types/v10';
import type { DefOf } from '../definition/DefOf.js';
import { withType } from './withType.js';

/** Defines an attachment option. */
export const attachment = <
  const Def extends DefOf<APIApplicationCommandAttachmentOption>,
>(
  def: Def,
) => withType(def, ApplicationCommandOptionType.Attachment);
