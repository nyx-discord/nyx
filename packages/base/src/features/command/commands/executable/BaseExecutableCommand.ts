import type {
  Awaitable,
  CommandCustomIdData,
  CommandFilterResolvable,
  ComponentCommandInteraction,
  ExecutableCommand,
  InteractionTypes,
  Metadata,
  Nameable,
  NyxBot,
} from '@nyx-discord/types';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { NotImplementedError } from '../../../../errors/NotImplementedError';
import { BaseCommand } from '../BaseCommand';

export abstract class BaseExecutableCommand<
  Data extends Nameable,
  CommandInteraction,
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseCommand<Data, Types>
  implements ExecutableCommand<Data, CommandInteraction, Types>
{
  protected readonly filter: CommandFilterResolvable<Types> | null = null;

  public abstract handleInteraction(
    interaction: ComponentCommandInteraction<Types>,
    metadata: Metadata,
  ): Awaitable<void>;

  public getFilter(): CommandFilterResolvable<Types> | null {
    return this.filter;
  }

  public buildCustomId(bot: NyxBot, extra?: string): string {
    const data: CommandCustomIdData = {
      type: ApplicationCommandType.ChatInput,
      name: this.data.name,
      subcommand: null,
      group: null,
      extra: extra ?? null,
    };
    return bot.getCommandManager().getCustomIdCodec().serialize(data);
  }

  public getCustomIdData(extra?: string): CommandCustomIdData {
    return {
      type: ApplicationCommandType.ChatInput,
      name: this.data.name,
      subcommand: null,
      group: null,
      extra: extra ?? null,
    };
  }

  public abstract execute(
    interaction: CommandInteraction,
    metadata: Metadata,
  ): Awaitable<void>;

  /** Handles a button interaction whose customId matches this command. */
  protected handleButton(
    _interaction: Types['ButtonInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles a select menu interaction whose customId matches this command. */
  protected handleSelectMenu(
    _interaction: Types['SelectMenuInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles a modal submit interaction whose customId matches this command. */
  protected handleModal(
    _interaction: Types['ModalSubmitInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }
}
