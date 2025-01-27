import type { ReadonlyCollection } from '@discordjs/collection';
import type { ApplicationCommand, ApplicationCommandType } from 'discord.js';

/** A type of Collection that holds ApplicationCommands of a certain command, keyed by their types. */
export type ApplicationCommandCollection = ReadonlyCollection<
  ApplicationCommandType,
  ApplicationCommand
>;
