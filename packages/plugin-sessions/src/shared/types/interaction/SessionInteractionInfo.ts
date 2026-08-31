/** Identity information about the interaction that started a session. */
export interface SessionInteractionInfo {
  /** The ID of the user that triggered the interaction. */
  userId: string;
  /** The ID of the guild the interaction happened in, or `null` if it was a DM. */
  guildId: string | null;
  /** The ID of the channel the interaction happened in. */
  channelId: string;
  /** Whether the interaction has already been replied to. */
  replied: boolean;
}
