import type { SlashCommandSubcommandsOnlyBuilder, Snowflake } from 'discord.js';

import type { Identifiable } from '../../../identity/Identifiable';
import type { ChildableCommand } from './child/ChildableCommand';
import type { SubCommand } from './SubCommand.js';
import type { SubCommandGroup } from './SubCommandGroup.js';

/**
 * A top level command that serves only to contain {@link SubCommand
 * subcommands} or {@link SubCommandGroup subcommand groups}. ParentCommands
 * cannot be executed by themselves, a subcommand must be specified.
 */
export interface ParentCommand
  extends ChildableCommand<
      ReturnType<SlashCommandSubcommandsOnlyBuilder['toJSON']>,
      SubCommand | SubCommandGroup
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
