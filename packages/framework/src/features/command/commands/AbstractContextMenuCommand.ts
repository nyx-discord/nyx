import type {
  CommandCustomIdData,
  ContextMenuCommand,
} from '@nyx-discord/core';
import type { MetaCollection } from '@nyx-discord/core';
import {
  ApplicationCommandType,
  type Awaitable,
  type ContextMenuCommandBuilder,
  type MessageContextMenuCommandInteraction,
  type Snowflake,
  type UserContextMenuCommandInteraction,
} from 'discord.js';
import { NotImplementedError } from '../../../errors/NotImplementedError';
import { AbstractExecutableCommand } from './executable/AbstractExecutableCommand';

export abstract class AbstractContextMenuCommand
  extends AbstractExecutableCommand<
    ReturnType<ContextMenuCommandBuilder['toJSON']>,
    MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction
  >
  implements ContextMenuCommand
{
  protected readonly customIdData: CommandCustomIdData = {
    type: ApplicationCommandType.Message,
    name: this.getName(),
    extra: null,
    subcommand: null,
    group: null,
  };

  public execute(
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction,
    metadata: MetaCollection,
  ): Awaitable<void> {
    if (interaction.isMessageContextMenuCommand()) {
      return this.executeMessage(interaction, metadata);
    } else if (interaction.isUserContextMenuCommand()) {
      return this.executeUser(interaction, metadata);
    }
  }

  public getName(): string {
    return this.createData().name;
  }

  public getData(): ReturnType<ContextMenuCommandBuilder['toJSON']> {
    return this.createData().toJSON();
  }

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.createData().name;
  }

  public override isContextMenu(): this is ContextMenuCommand {
    return true;
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.getName()];
  }

  /** Returns this command's data. */
  protected abstract createData(): ContextMenuCommandBuilder;

  /** Executes a {@link UserContextMenuCommandInteraction}. */
  protected executeUser(
    _interaction: UserContextMenuCommandInteraction,
    _metadata: MetaCollection,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Executes a {@link MessageContextMenuCommandInteraction}. */
  protected executeMessage(
    _interaction: MessageContextMenuCommandInteraction,
    _metadata: MetaCollection,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }
}
