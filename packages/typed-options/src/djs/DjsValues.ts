import type {
  APIInteractionDataResolvedGuildMember,
  APIRole,
} from 'discord-api-types/v10';
import type {
  Attachment,
  CommandInteractionOption,
  GuildMember,
  Role,
  User,
} from 'discord.js';
import type { ValueMap } from '../base/typed/ValueMap.js';

/** The values discord.js returns for each option kind. */
export interface DjsValues extends ValueMap {
  user: User;
  member: GuildMember | APIInteractionDataResolvedGuildMember;
  role: Role | APIRole;
  attachment: Attachment;
  channel: NonNullable<CommandInteractionOption['channel']>;
}
