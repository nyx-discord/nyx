import type { SlashCommandSubcommandGroupBuilder } from 'discord.js';
import type { ChildableCommand } from './child/ChildableCommand';
import type { ChildCommand } from './child/ChildCommand';
import type { ParentCommand } from './ParentCommand.js';
import type { SubCommand } from './SubCommand.js';

/**
 * An SubCommand Group belonging to an {@link ParentCommand}.
 * This cannot be executed by itself and merely exists for grouping {@link SubCommand subcommands}.
 */
export interface SubCommandGroup
  extends ChildableCommand<SlashCommandSubcommandGroupBuilder, SubCommand>,
    ChildCommand<SlashCommandSubcommandGroupBuilder, ParentCommand> {}
