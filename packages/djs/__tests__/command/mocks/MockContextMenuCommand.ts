import type { RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { vi } from 'vitest';
import { AbstractContextMenuCommand } from '../../../src';

export class MockContextMenuCommand extends AbstractContextMenuCommand {
  public override execute = vi.fn();

  public override executeUser = vi.fn();

  public override executeMessage = vi.fn();

  protected readonly data: RESTPostAPIContextMenuApplicationCommandsJSONBody;

  constructor(
    name = 'mock-context-menu',
    type:
      | ApplicationCommandType.User
      | ApplicationCommandType.Message = ApplicationCommandType.User,
  ) {
    super();
    this.data = {
      name,
      type,
    } as RESTPostAPIContextMenuApplicationCommandsJSONBody;
  }
}
