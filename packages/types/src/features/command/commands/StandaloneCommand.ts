import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from 'discord-api-types/v10';
import type { Identifiable } from '../../../identity/Identifiable';
import type { InteractionTypes } from '../InteractionTypes';
import type { ChatExecutableCommand } from './executable/ChatExecutableCommand';

/** A standalone command, i.e. a slash command with no children. */
export interface StandaloneCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends
    ChatExecutableCommand<
      RESTPostAPIChatInputApplicationCommandsJSONBody,
      Types
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
