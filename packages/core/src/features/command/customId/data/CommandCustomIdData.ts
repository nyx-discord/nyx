import type { ApplicationCommandType } from 'discord.js';

/** Data that can be de/serialized from/to a command customId. */
export type CommandCustomIdData = {
  /** The command's type. */
  type: ApplicationCommandType;
  /** The command's name. */
  name: string;
  /** Extra user-provided data, if desired. */
  extra: string | null;
} & (
  | {
      /** The subcommand's name, if any. */
      subcommand: null;
      /** The subcommand group's name, if any. */
      group: null;
    }
  | {
      /** The subcommand's name, if any. */
      subcommand: string;
      /** The subcommand group's name, if any. */
      group: string | null;
    }
);
