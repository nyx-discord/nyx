import type {
  ApplicationCommand,
  ApplicationCommandType,
  ReadonlyCollection,
} from 'discord.js';

/** A type of Collection that holds ApplicationCommands of a certain command, keyed by their types. */
export type ApplicationCommandCollection = ReadonlyCollection<
  ApplicationCommandType,
  ApplicationCommand
>;
