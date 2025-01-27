import type { SlashCommandSubcommandBuilder } from 'discord.js';
import type { ChildCommand } from './child/ChildCommand';
import type { ChatExecutableCommand } from './executable/ChatExecutableCommand';
import type { ParentCommand } from './ParentCommand.js';
import type { SubCommandGroup } from './SubCommandGroup.js';

/** A child, executable command that belongs to a {@link ParentCommand} or {@link SubCommandGroup}. */
export interface SubCommand
  extends ChatExecutableCommand<SlashCommandSubcommandBuilder>,
    ChildCommand<
      SlashCommandSubcommandBuilder,
      ParentCommand | SubCommandGroup
    > {}
