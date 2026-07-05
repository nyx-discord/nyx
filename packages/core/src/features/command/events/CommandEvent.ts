import type { AutocompleteInteraction } from 'discord.js';
import type { Metadata } from '../../../meta/Metadata';
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
export interface CommandEventArgs {
  commandAdd: [command: TopLevelCommand];
  commandRemove: [command: TopLevelCommand];
  commandRun: [
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: Metadata,
  ];
  commandAutocomplete: [
    command: AnyExecutableCommand,
    interaction: AutocompleteInteraction,
    meta: Metadata,
  ];
}
