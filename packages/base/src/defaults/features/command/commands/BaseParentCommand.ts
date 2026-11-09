import type { ParentCommand } from '#types/features/command/commands/ParentCommand';
import type { SubCommand } from '#types/features/command/commands/SubCommand';
import type { SubCommandGroup } from '#types/features/command/commands/SubCommandGroup';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from 'discord-api-types/v10';
import { BaseChildableCommand } from './child/BaseChildableCommand';

export abstract class BaseParentCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseChildableCommand<
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SubCommand<Types> | SubCommandGroup<Types>,
    Types
  >
  implements ParentCommand<Types>
{
  protected override readonly childLimit = 25;

  public override isParent(): this is ParentCommand<Types> {
    return true;
  }

  public override getData(): RESTPostAPIChatInputApplicationCommandsJSONBody {
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
}
