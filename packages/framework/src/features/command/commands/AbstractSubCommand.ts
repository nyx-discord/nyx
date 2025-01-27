import type {
  CommandExecutionMeta,
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';
import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { NotImplementedError } from '../../../errors/NotImplementedError';

import { AbstractExecutableCommand } from './executable/AbstractExecutableCommand';

/** A child, executable command that belongs to an {@link ParentCommand} or {@link SubCommandGroup}. */
export abstract class AbstractSubCommand
  extends AbstractExecutableCommand<
    SlashCommandSubcommandBuilder,
    ChatInputCommandInteraction
  >
  implements SubCommand
{
  protected readonly parent: ParentCommand | SubCommandGroup;

  constructor(parent: ParentCommand | SubCommandGroup) {
    super();
    this.parent = parent;
  }

  public getName(): string {
    return this.createData().name;
  }

  public getParent(): ParentCommand | SubCommandGroup {
    return this.parent;
  }

  public override isSubCommand(): this is SubCommand {
    return true;
  }

  public autocomplete(
    _interaction: AutocompleteInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getData(): SlashCommandSubcommandBuilder {
    return this.createData();
  }

  public getNameTree(): ReadonlyArray<string> {
    return this.parent.getNameTree().concat(this.getName());
  }

  /** Returns this subcommand's data. */
  protected abstract createData(): SlashCommandSubcommandBuilder;
}
