import type {
  ApplicationCommandInteraction,
  CommandExecutionMeta,
  CommandFilter,
  ComponentCommandInteraction,
  CustomIdBuilder,
  ExecutableCommand,
  NyxBot,
} from '@nyx-discord/core';
import type {
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
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

  /** Returns this command's {@link CustomIdBuilder} on the given bot. */
  protected getCustomIdBuilder(bot: NyxBot): CustomIdBuilder {
    return bot
      .getCommandManager()
      .getCustomIdCodec()
      .createCustomIdBuilder(this);
  }

  /** Returns this command's customId on the given bot. */
  protected getCustomId(bot: NyxBot): string {
    return bot.getCommandManager().getCustomIdCodec().serializeToCustomId(this);
  }
}
