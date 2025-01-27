import type { SlashCommandOptionsOnlyBuilder, Snowflake } from 'discord.js';

import type { Identifiable } from '../../../identity/Identifiable';
import type { ChatExecutableCommand } from './executable/ChatExecutableCommand';

/** A standalone command, i.e. a slash command with no children. */
export interface StandaloneCommand
  extends ChatExecutableCommand<
      ReturnType<SlashCommandOptionsOnlyBuilder['toJSON']>
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
