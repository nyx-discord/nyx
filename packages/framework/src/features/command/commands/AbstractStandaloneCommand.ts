import type {
  CommandCustomIdData,
  CommandExecutionMeta,
  StandaloneCommand,
} from '@nyx-discord/core';
import {
  ApplicationCommandType,
  type AutocompleteInteraction,
  type Awaitable,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type Snowflake,
} from 'discord.js';
import { NotImplementedError } from '../../../errors/NotImplementedError';
import { AbstractExecutableCommand } from './executable/AbstractExecutableCommand';

export abstract class AbstractStandaloneCommand
  extends AbstractExecutableCommand<
    ReturnType<SlashCommandOptionsOnlyBuilder['toJSON']>,
    ChatInputCommandInteraction
  >
  implements StandaloneCommand
{
  protected readonly customIdData: CommandCustomIdData = {
    type: ApplicationCommandType.ChatInput,
    name: this.getName(),
    extra: null,
    subcommand: null,
    group: null,
  };

  public getName(): string {
    return this.createData().name;
  }

  public getData(): ReturnType<SlashCommandBuilder['toJSON']> {
    return this.createData().toJSON();
  }

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.createData().name;
  }

  public override isStandalone(): this is StandaloneCommand {
    return true;
  }

  public autocomplete(
    _interaction: AutocompleteInteraction,
    _metadata: CommandExecutionMeta,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.getName()];
  }

  /** Returns this command's data. */
  protected abstract createData(): SlashCommandOptionsOnlyBuilder;
}
