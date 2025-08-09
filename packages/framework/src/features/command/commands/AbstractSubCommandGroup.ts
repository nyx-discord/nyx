import type {
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';
import type { SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { AbstractChildableCommand } from './child/AbstractChildableCommand';

export abstract class AbstractSubCommandGroup
  extends AbstractChildableCommand<
    ReturnType<SlashCommandSubcommandGroupBuilder['toJSON']>,
    SubCommand
  >
  implements SubCommandGroup
{
  protected override readonly childLimit = 25;

  protected readonly parent: ParentCommand;

  constructor(parent: ParentCommand) {
    super();
    this.parent = parent;
  }

  public override isSubCommandGroup(): this is SubCommandGroup {
    return true;
  }

  public getParent(): ParentCommand {
    return this.parent;
  }

  public getNameTree(): ReadonlyArray<string> {
    return this.parent.getNameTree().concat(this.data.name);
  }
}
