import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Metadata } from '../../../../meta/Metadata';
import type { Nameable } from '../../../../types/Nameable';
import type { ExecutableCommand } from './ExecutableCommand';

/**
 * A command that can be executed in chat.
 * Either {@link SubCommand} or {@link StandaloneCommand}.
 */
export interface ChatExecutableCommand<Data extends Nameable>
  extends ExecutableCommand<Data, ChatInputCommandInteraction> {
  /** Responds to the given AutocompleteInteraction. */
  autocomplete(
    interaction: AutocompleteInteraction,
    metadata: Metadata,
  ): Awaitable<void>;
}
