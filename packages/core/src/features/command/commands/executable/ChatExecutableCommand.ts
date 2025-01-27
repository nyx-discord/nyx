import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { CommandExecutionMeta } from '../../execution/meta/CommandExecutionMeta';
import type { ExecutableCommand } from './ExecutableCommand';

/**
 * A command that can be executed in chat.
 * Either {@link SubCommand} or {@link StandaloneCommand}.
 */
export interface ChatExecutableCommand<Data>
  extends ExecutableCommand<Data, ChatInputCommandInteraction> {
  /** Responds to the given AutocompleteInteraction. */
  autocomplete(
    interaction: AutocompleteInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
