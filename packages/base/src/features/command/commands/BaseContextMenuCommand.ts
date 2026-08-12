import type {
  Awaitable,
  ContextMenuCommand,
  InteractionTypes,
  Metadata,
} from '@nyx-discord/types';
import type {
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Snowflake,
} from 'discord-api-types/v10';
import { NotImplementedError } from '../../../errors/NotImplementedError';
import { BaseExecutableCommand } from './executable/BaseExecutableCommand';

export abstract class BaseContextMenuCommand<
  Types extends InteractionTypes = InteractionTypes,
>
  extends BaseExecutableCommand<
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    Types['ContextMenuInteraction'],
    Types
  >
  implements ContextMenuCommand<Types>
{
  public abstract override execute(
    interaction: Types['ContextMenuInteraction'],
    metadata: Metadata,
  ): Awaitable<void>;

  public getGuilds(): ReadonlyArray<Snowflake> | null {
    return null;
  }

  public getId(): string {
    return this.data.name;
  }

  public override isContextMenu(): this is ContextMenuCommand<Types> {
    return true;
  }

  public getNameTree(): ReadonlyArray<string> {
    return [this.data.name];
  }

  /** Executes a user context menu command. */
  protected executeUser(
    _interaction: Types['UserContextMenuInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }

  /** Executes a message context menu command. */
  protected executeMessage(
    _interaction: Types['MessageContextMenuInteraction'],
    _metadata: Metadata,
  ): Awaitable<void> {
    throw new NotImplementedError();
  }
}
