import type { APIApplicationCommandSubcommandGroupOption } from 'discord-api-types/v10';
import type { InteractionTypes } from '../InteractionTypes';
import type { ChildableCommand } from './child/ChildableCommand';
import type { ChildCommand } from './child/ChildCommand';
import type { ParentCommand } from './ParentCommand.js';
import type { SubCommand } from './SubCommand.js';

/**
 * An SubCommand Group belonging to an {@link ParentCommand}.
 * This cannot be executed by itself and merely exists for grouping {@link SubCommand subcommands}.
 */
export interface SubCommandGroup<
  Types extends InteractionTypes = InteractionTypes,
>
  extends
    ChildableCommand<
      APIApplicationCommandSubcommandGroupOption,
      SubCommand<Types>,
      Types
    >,
    ChildCommand<
      APIApplicationCommandSubcommandGroupOption,
      ParentCommand<Types>,
      Types
    > {}
