import type {
  InteractionTypes,
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandGroupOption } from 'discord-api-types/v10';
import { BaseChildableCommand } from './child/BaseChildableCommand';

export abstract class BaseSubCommandGroup<
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseChildableCommand<
    APIApplicationCommandSubcommandGroupOption,
    SubCommand<Types>,
    Types
  >
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

  public getParent(): ParentCommand<Types> {
    return this.parent;
  }

  public getNameTree(): ReadonlyArray<string> {
    return this.parent.getNameTree().concat(this.data.name);
  }
}
