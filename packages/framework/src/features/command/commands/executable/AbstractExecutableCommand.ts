import type {
  ApplicationCommandInteraction,
  CommandCustomIdData,
  CommandExecutionMeta,
  CommandFilter,
  ComponentCommandInteraction,
  ExecutableCommand,
  NyxBot,
} from '@nyx-discord/core';
import {
  type AnySelectMenuInteraction,
  type Awaitable,
  type ButtonInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';

import { NotImplementedError } from '../../../../errors/NotImplementedError';
import { AbstractCommand } from '../AbstractCommand';

export abstract class AbstractExecutableCommand<
    Data,
    Interaction extends ApplicationCommandInteraction,
  >
  extends AbstractCommand<Data>
  implements ExecutableCommand<Data, Interaction>
{
  protected abstract readonly customIdData: CommandCustomIdData;

  protected readonly filter: CommandFilter | null = null;

  public handleInteraction(
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    if (interaction.isButton()) return this.handleButton(interaction, metadata);
    if (interaction.isModalSubmit()) {
      return this.handleModal(interaction, metadata);
    }
    return this.handleSelectMenu(interaction, metadata);
  }

  public getFilter(): CommandFilter | null {
    return this.filter;
  }

  public buildCustomId(bot: NyxBot, extra?: string): string {
    const data = { ...this.customIdData, extra: extra ?? null };
    return bot.getCommandManager().getCustomIdCodec().serialize(data);
  }

  public getCustomIdData(extra?: string): CommandCustomIdData {
    return { ...this.customIdData, extra: extra ?? null };
  }

  public abstract execute(
    interaction: Interaction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Handles a {@link ButtonInteraction} whose customId matches this command. */
  protected handleButton(
    _interaction: ButtonInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles an {@link AnySelectMenuInteraction} whose customId matches this command. */
  protected handleSelectMenu(
    _interaction: AnySelectMenuInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Handles a {@link ModalSubmitInteraction} whose customId matches this command. */
  protected handleModal(
    _interaction: ModalSubmitInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Returns this command's customId on the given bot. */
  protected getCustomId(bot: NyxBot, extra?: string): string {
    return bot
      .getCommandManager()
      .getCustomIdCodec()
      .serialize({ ...this.customIdData, extra: extra ?? null });
  }
}
