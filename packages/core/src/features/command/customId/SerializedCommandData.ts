import type { ApplicationCommandType } from 'discord.js';

export interface SerializedCommandData {
  id: string;
  type: ApplicationCommandType;
  childId: string | null;
}
