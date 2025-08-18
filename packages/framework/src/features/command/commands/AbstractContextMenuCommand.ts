import type { ContextMenuCommand, MetaCollection } from '@nyx-discord/core';
import type { ContextMenuCommandInteraction } from 'discord.js';
import {
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
    ContextMenuCommandInteraction
  >
  implements ContextMenuCommand
{
  public execute(
    interaction: ContextMenuCommandInteraction,
    metadata: MetaCollection,
  ): Awaitable<void> {
    if (interaction.isMessageContextMenuCommand()) {
      return this.executeMessage(interaction, metadata);
    } else if (interaction.isUserContextMenuCommand()) {
      return this.executeUser(interaction, metadata);
    }
  }

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.data.name;
  }

  public override isContextMenu(): this is ContextMenuCommand {
    return true;
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.data.name];
  }

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
