import type {
  CommandCustomIdData,
  MetaCollection,
  StandaloneCommand,
} from '@nyx-discord/core';
import {
  ApplicationCommandType,
  type AutocompleteInteraction,
  type Awaitable,
  type ChatInputCommandInteraction,
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
    name: this.getData().name,
    extra: null,
    subcommand: null,
    group: null,
  };

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.data.name;
  }

  public override isStandalone(): this is StandaloneCommand {
    return true;
  }

  public autocomplete(
    _interaction: AutocompleteInteraction,
    _metadata: MetaCollection,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.data.name];
  }
}
