import type {
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';
import type {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption,
  SlashCommandSubcommandsOnlyBuilder,
  Snowflake,
} from 'discord.js';
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

  public override getData(): ReturnType<
    SlashCommandSubcommandsOnlyBuilder['toJSON']
  > {
    const options: APIApplicationCommandOption[] = [];

    for (const child of this.children.values()) {
      if (child.isSubCommand()) {
        options.push(child.getData());
      } else if (child.isSubCommandGroup()) {
        const groupData = child.getData();
        const groupOptions: APIApplicationCommandSubcommandOption[] = [];

        for (const subCommand of child.getChildren().values()) {
          groupOptions.push(subCommand.getData());
        }

        options.push({ ...groupData, options: groupOptions });
      }
    }

    return { ...this.data, options };
  }

  public getId(): string {
    return this.data.name;
  }

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.data.name];
  }
}
