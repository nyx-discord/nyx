import type {
  APIApplicationCommandSubcommandGroupOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

/** The data a subcommand group is declared with, where `type` can be omitted since it's always {@link ApplicationCommandOptionType.SubcommandGroup}. */
export type SubCommandGroupData = Omit<
  APIApplicationCommandSubcommandGroupOption,
  'type'
> & { type?: ApplicationCommandOptionType.SubcommandGroup };
