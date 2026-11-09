import type { NyxBot } from '#types/bot/NyxBot';
import type { ExecutableCommand } from '#types/features/command/commands/executable/ExecutableCommand';
import type { CommandCustomIdData } from '#types/features/command/customId/data/CommandCustomIdData';
import type { CommandFilterResolvable } from '#types/features/command/filter/CommandFilterResolvable';
import type { ComponentCommandInteraction } from '#types/features/command/interaction/ComponentCommandInteraction';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import type { Nameable } from '#types/types/Nameable';
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
