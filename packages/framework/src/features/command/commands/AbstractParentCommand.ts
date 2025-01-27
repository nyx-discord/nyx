import type {
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';
import { AssertionError } from '@nyx-discord/core';
import type { SlashCommandSubcommandsOnlyBuilder, Snowflake } from 'discord.js';

import { AbstractChildableCommand } from './child/AbstractChildableCommand';

export abstract class AbstractParentCommand
  extends AbstractChildableCommand<
    ReturnType<SlashCommandSubcommandsOnlyBuilder['toJSON']>,
    SubCommand | SubCommandGroup
  >
  implements ParentCommand
{
  protected override readonly childLimit = 25;

  public override isParent(): this is ParentCommand {
    return true;
  }

  public getData(): ReturnType<SlashCommandSubcommandsOnlyBuilder['toJSON']> {
    const data = this.createData();
    if (data.options.length) {
      throw new AssertionError('ParentCommands cannot set their options.');
    }

    for (const child of this.children.values()) {
      if (child.isSubCommand()) {
        data.addSubcommand(child.getData());
      } else if (child.isSubCommandGroup()) {
        data.addSubcommandGroup(() => {
          const builder = child.getData();
          if (builder.options.length) {
            throw new AssertionError(
              'SubCommandGroups cannot set their options.',
            );
          }

          for (const subCommand of child.getChildren().values()) {
            builder.addSubcommand(subCommand.getData());
          }

          return builder;
        });
      }
    }

    return data.toJSON();
  }

  public getId(): string {
    return this.createData().name;
  }

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getName(): string {
    return this.createData().name;
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.getName()];
  }

  /** Returns this command's data. */
  protected abstract createData(): SlashCommandSubcommandsOnlyBuilder;
}
