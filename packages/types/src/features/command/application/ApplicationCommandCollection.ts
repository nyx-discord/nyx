import type {
  ApplicationCommandType,
  APIApplicationCommand,
} from 'discord-api-types/v10';
import type { ReadonlyCollection } from '@discordjs/collection';

/** A type of Collection that holds ApplicationCommands of a certain command, keyed by their types. */
export type ApplicationCommandCollection<
  ApplicationCommand = APIApplicationCommand,
> = ReadonlyCollection<ApplicationCommandType, ApplicationCommand>;
