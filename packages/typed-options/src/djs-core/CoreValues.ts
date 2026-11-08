import type {
  APIAttachment,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  APIUser,
} from 'discord-api-types/v10';
import type { ValueMap } from '../base/typed/ValueMap.js';

/** The values raw API payloads carry for each option kind. */
export interface CoreValues extends ValueMap {
  user: APIUser;
  member: APIInteractionDataResolvedGuildMember;
  role: APIRole;
  attachment: APIAttachment;
  channel: APIInteractionDataResolvedChannel;
}
