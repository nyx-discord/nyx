import type { Metadata } from '../../../meta/Metadata';
import type { InteractionTypes } from '../InteractionTypes';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { TopLevelCommand } from '../commands/TopLevelCommand.js';
import type { CommandExecutableInteraction } from '../interaction/CommandExecutableInteraction.js';

/** Enum of possible command events. */
export const CommandEventEnum = {
  CommandAdd: 'commandAdd',
  CommandRemove: 'commandRemove',
  CommandRun: 'commandRun',
  CommandAutocomplete: 'commandAutocomplete',
} as const satisfies Record<string, keyof CommandEventArgs>;

/** Type of values of {@link CommandEventEnum}. */
export type CommandEvent =
  (typeof CommandEventEnum)[keyof typeof CommandEventEnum];

/** Record of arguments for each command event. */
export interface CommandEventArgs<
  Types extends InteractionTypes = InteractionTypes,
> {
  commandAdd: [command: TopLevelCommand<Types>];
  commandRemove: [command: TopLevelCommand<Types>];
  commandRun: [
    command: AnyExecutableCommand<Types>,
    interaction: CommandExecutableInteraction<Types>,
    meta: Metadata,
  ];
  commandAutocomplete: [
    command: AnyExecutableCommand<Types>,
    interaction: Types['AutocompleteInteraction'],
    meta: Metadata,
  ];
}
