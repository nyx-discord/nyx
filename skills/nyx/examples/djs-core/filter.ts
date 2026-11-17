// Filters and middlewares with @discordjs/core: use the Core* helpers instead of the Djs* ones.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/filters.md
import {
  AbstractCommandFilter,
  type CoreAnyExecutableCommand,
  type CoreCommandFilterResolvable,
  type CoreCommandResolvableInteraction,
  type Metadata,
} from '@nyx-discord/djs-core';

export class GuildOnlyFilter extends AbstractCommandFilter {
  public async check(
    _command: CoreAnyExecutableCommand,
    interaction: CoreCommandResolvableInteraction,
    _meta: Metadata,
  ): Promise<boolean> {
    return interaction.data.guild_id !== undefined;
  }
}

export const notInDms: CoreCommandFilterResolvable = (_command, interaction) =>
  interaction.data.guild_id !== undefined;
