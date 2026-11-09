import type { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';
import type { InteractionTypes } from '../InteractionTypes';
import type { ChildCommand } from './child/ChildCommand';
import type { ChatExecutableCommand } from './executable/ChatExecutableCommand';
import type { ParentCommand } from './ParentCommand.js';
import type { SubCommandGroup } from './SubCommandGroup.js';

/** A child, executable command that belongs to a {@link ParentCommand} or {@link SubCommandGroup}. */
export interface SubCommand<Types extends InteractionTypes = InteractionTypes>
  extends
    ChatExecutableCommand<APIApplicationCommandSubcommandOption, Types>,
    ChildCommand<
      APIApplicationCommandSubcommandOption,
      ParentCommand<Types> | SubCommandGroup<Types>,
      Types
    > {}
