import type { SubCommandGroupData } from '#types/features/command/commands/data/SubCommandGroupData';
import type { ParentCommand } from '#types/features/command/commands/ParentCommand';
import type { SubCommand } from '#types/features/command/commands/SubCommand';
import type { SubCommandGroup } from '#types/features/command/commands/SubCommandGroup';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { APIApplicationCommandSubcommandGroupOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { BaseChildableCommand } from './child/BaseChildableCommand';

export abstract class BaseSubCommandGroup<
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseChildableCommand<SubCommandGroupData, SubCommand<Types>, Types>
  implements SubCommandGroup<Types>
{
  protected override readonly childLimit = 25;

  protected readonly parent: ParentCommand<Types>;

  constructor(parent: ParentCommand<Types>) {
    super();
    this.parent = parent;
  }

  public override isSubCommandGroup(): this is SubCommandGroup<Types> {
    return true;
  }

  public override getData(): APIApplicationCommandSubcommandGroupOption {
    return {
      ...this.data,
      type: ApplicationCommandOptionType.SubcommandGroup,
    };
  }

  public getParent(): ParentCommand<Types> {
    return this.parent;
  }
}
