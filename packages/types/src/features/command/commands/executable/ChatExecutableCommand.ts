import type { Metadata } from '../../../../meta/Metadata';
import type { Awaitable } from '../../../../types/Awaitable.js';
import type { Nameable } from '../../../../types/Nameable';
import type { InteractionTypes } from '../../InteractionTypes';
import type { ExecutableCommand } from './ExecutableCommand';

/**
 * A command that can be executed in chat.
 * Either {@link SubCommand} or {@link StandaloneCommand}.
 */
export interface ChatExecutableCommand<
  Data extends Nameable,
  Types extends InteractionTypes = InteractionTypes,
> extends ExecutableCommand<Data, Types['ChatInputInteraction'], Types> {
  /** Responds to the given AutocompleteInteraction. */
  autocomplete(
    interaction: Types['AutocompleteInteraction'],
    metadata: Metadata,
  ): Awaitable<void>;
}
