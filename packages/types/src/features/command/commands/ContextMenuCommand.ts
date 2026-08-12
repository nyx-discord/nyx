import type { Snowflake } from 'discord-api-types/v10';
import type { Identifiable } from '../../../identity/Identifiable';
import type { InteractionTypes } from '../InteractionTypes';
import type { ExecutableCommand } from './executable/ExecutableCommand';

/** A command that can be executed by a context menu. */
export interface ContextMenuCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends
    ExecutableCommand<
      import('discord-api-types/v10').RESTPostAPIContextMenuApplicationCommandsJSONBody,
      Types['ContextMenuInteraction'],
      Types
    >,
    Identifiable<string> {
  /** Gets the guilds this command can be executed in. `null` for global commands. */
  getGuilds(): ReadonlyArray<Snowflake> | null;
}
