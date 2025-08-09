import type {
  CommandCustomIdData,
  MetaCollection,
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';
import {
  ApplicationCommandType,
  type AutocompleteInteraction,
  type Awaitable,
  type ChatInputCommandInteraction,
  type SlashCommandSubcommandBuilder,
} from 'discord.js';
import { NotImplementedError } from '../../../errors/NotImplementedError';
import { AbstractExecutableCommand } from './executable/AbstractExecutableCommand';

/** A child, executable command that belongs to an {@link ParentCommand} or {@link SubCommandGroup}. */
export abstract class AbstractSubCommand
  extends AbstractExecutableCommand<
    ReturnType<SlashCommandSubcommandBuilder['toJSON']>,
    ChatInputCommandInteraction
  >
  implements SubCommand
{
  protected readonly customIdData: CommandCustomIdData;

  protected readonly parent: ParentCommand | SubCommandGroup;

  constructor(parent: ParentCommand | SubCommandGroup) {
    super();
    this.parent = parent;
    this.customIdData = {
      type: ApplicationCommandType.ChatInput,
      name: this.parent.isParent()
        ? this.parent.getData().name
        : this.parent.getParent().getData().name,
      extra: null,
      subcommand: this.getData().name,
      group: this.parent.isSubCommandGroup()
        ? this.parent.getData().name
        : null,
    };
  }

  public getParent(): ParentCommand | SubCommandGroup {
    return this.parent;
  }

  public override isSubCommand(): this is SubCommand {
    return true;
  }

  public autocomplete(
    _interaction: AutocompleteInteraction,
    _metadata: MetaCollection,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getNameTree(): ReadonlyArray<string> {
    return this.parent.getNameTree().concat(this.data.name);
  }
}
