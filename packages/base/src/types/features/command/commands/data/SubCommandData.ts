import type {
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

/** The data a subcommand is declared with, where `type` can be omitted since it's always {@link ApplicationCommandOptionType.Subcommand}. */
export type SubCommandData = Omit<
  APIApplicationCommandSubcommandOption,
  'type'
> & { type?: ApplicationCommandOptionType.Subcommand };
