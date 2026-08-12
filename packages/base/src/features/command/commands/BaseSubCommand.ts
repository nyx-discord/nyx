import type {
  Awaitable,
  CommandCustomIdData,
  InteractionTypes,
  Metadata,
  NyxBot,
  ParentCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { NotImplementedError } from '../../../errors/NotImplementedError';
import { BaseExecutableCommand } from './executable/BaseExecutableCommand';

/** A child, executable command that belongs to an {@link ParentCommand} or {@link SubCommandGroup}. */
export abstract class BaseSubCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseExecutableCommand<
    APIApplicationCommandSubcommandOption,
    Types['ChatInputInteraction'],
    Types
  >
  implements SubCommand<Types>
{
  protected readonly parent: ParentCommand<Types> | SubCommandGroup<Types>;

  constructor(parent: ParentCommand<Types> | SubCommandGroup<Types>) {
    super();
    this.parent = parent;
  }

  public getParent(): ParentCommand<Types> | SubCommandGroup<Types> {
    return this.parent;
  }

  public override isSubCommand(): this is SubCommand<Types> {
    return true;
  }

  public autocomplete(
    _interaction: Types['AutocompleteInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getNameTree(): ReadonlyArray<string> {
    return this.parent.getNameTree().concat(this.data.name);
  }

  public override buildCustomId(bot: NyxBot, extra?: string): string {
    const data = this.getCustomIdData(extra);
    return bot.getCommandManager().getCustomIdCodec().serialize(data);
  }

  public override getCustomIdData(extra?: string): CommandCustomIdData {
    return {
      type: ApplicationCommandType.ChatInput,
      name: this.parent.isParent()
        ? this.parent.getData().name
        : this.parent.getParent().getData().name,
      extra: extra ?? null,
      subcommand: this.getData().name,
      group: this.parent.isSubCommandGroup()
        ? this.parent.getData().name
        : null,
    };
  }
}
