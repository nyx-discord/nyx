import type {
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  Snowflake,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import type { Identifiable } from '../../../identity/Identifiable';
import type { ExecutableCommand } from './executable/ExecutableCommand';

/** A command that can be executed by a context menu. */
export interface ContextMenuCommand
  extends ExecutableCommand<
      ReturnType<ContextMenuCommandBuilder['toJSON']>,
      MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
