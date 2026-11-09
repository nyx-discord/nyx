import type { Command } from '#types/features/command/commands/Command';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { Nameable } from '#types/types/Nameable';

/** Returns the names of the tree of a command, from its top level command down to itself (e.g. `['parent', 'group', 'sub']`). */
export function getCommandNameTree<Types extends InteractionTypes>(
  command: Command<Nameable, Types>,
): string[] {
  const names: string[] = [];
  let current: Command<Nameable, Types> | null = command;

  while (current) {
    names.unshift(current.getData().name);
    current =
      current.isSubCommand() || current.isSubCommandGroup()
        ? current.getParent()
        : null;
  }

  return names;
}
