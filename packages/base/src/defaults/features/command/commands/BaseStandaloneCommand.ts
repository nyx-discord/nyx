import type { StandaloneCommand } from '#types/features/command/commands/StandaloneCommand';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from 'discord-api-types/v10';
import { NotImplementedError } from '../../../errors/NotImplementedError';
import { BaseExecutableCommand } from './executable/BaseExecutableCommand';

export abstract class BaseStandaloneCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseExecutableCommand<
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Types['ChatInputInteraction'],
    Types
  >
  implements StandaloneCommand<Types>
{
  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.data.name;
  }

  public override isStandalone(): this is StandaloneCommand<Types> {
    return true;
  }

  public autocomplete(
    _interaction: Types['AutocompleteInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.data.name];
  }
}
