import type { Metadata, StandaloneCommand } from '@nyx-discord/core';
import {
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
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.data.name];
  }
}
