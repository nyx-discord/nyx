import type {
  ApplicationCommandInteraction,
  CommandCustomIdData,
  CommandFilterResolvable,
  ComponentCommandInteraction,
  ExecutableCommand,
  Metadata,
  Nameable,
  NyxBot,
} from '@nyx-discord/core';
import {
  type AnySelectMenuInteraction,
  ApplicationCommandType,
  type Awaitable,
  type ButtonInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';
import { NotImplementedError } from '../../../../errors/NotImplementedError';
import { AbstractCommand } from '../AbstractCommand';

export abstract class AbstractExecutableCommand<
    Data extends Nameable,
    Interaction extends ApplicationCommandInteraction,
  >
  extends AbstractCommand<Data>
  implements ExecutableCommand<Data, Interaction>
{
  protected readonly filter: CommandFilterResolvable | null = null;

  public handleInteraction(
    interaction: ComponentCommandInteraction,
    metadata: Metadata,
  ): Awaitable<void> {
    if (interaction.isButton()) return this.handleButton(interaction, metadata);
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, metadata);
    }
    return this.handleSelectMenu(interaction, metadata);
  }

  public getFilter(): CommandFilterResolvable | null {
    return this.filter;
  }

  public buildCustomId(bot: NyxBot, extra?: string): string {
    const data = {
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
    interaction: Interaction,
    metadata: Metadata,
  ): Awaitable<void>;

  /** Handles a {@link ButtonInteraction} whose customId matches this command. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this command. */
  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this command. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }
}
