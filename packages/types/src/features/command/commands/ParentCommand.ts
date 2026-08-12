import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from 'discord-api-types/v10';
import type { Identifiable } from '../../../identity/Identifiable';
import type { InteractionTypes } from '../InteractionTypes';
import type { ChildableCommand } from './child/ChildableCommand';
import type { SubCommand } from './SubCommand.js';
import type { SubCommandGroup } from './SubCommandGroup.js';

/**
 * A top level command that serves only to contain {@link SubCommand
 * subcommands} or {@link SubCommandGroup subcommand groups}. ParentCommands
 * cannot be executed by themselves, a subcommand must be specified.
 */
export interface ParentCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends
    ChildableCommand<
      RESTPostAPIChatInputApplicationCommandsJSONBody,
      SubCommand<Types> | SubCommandGroup<Types>,
      Types
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
