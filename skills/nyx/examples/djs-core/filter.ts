// Filters and middlewares with @discordjs/core: use CoreInteractionTypes instead of DjsInteractionTypes.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/filters.md
import {
  BaseCommandFilter,
  type AnyExecutableCommand,
  type CommandFilterResolvable,
  type CommandResolvableInteraction,
  type CoreInteractionTypes,
  type Metadata,
} from '@nyx-discord/djs-core';

export class GuildOnlyFilter extends BaseCommandFilter {
  public async check(
    _command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<CoreInteractionTypes>,
    _meta: Metadata,
  ): Promise<boolean> {
    return interaction.data.guild_id !== undefined;
  }
}

export const notInDms: CommandFilterResolvable<CoreInteractionTypes> = (_command, interaction) =>
  interaction.data.guild_id !== undefined;
