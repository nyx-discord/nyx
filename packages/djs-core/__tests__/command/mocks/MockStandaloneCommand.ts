import type { Snowflake } from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { vi } from 'vitest';
import { AbstractStandaloneCommand } from '../../../src';

export class MockStandaloneCommand extends AbstractStandaloneCommand {
  public execute = vi.fn();

  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  protected readonly guilds: ReadonlyArray<Snowflake> | null;

  constructor(
    name = 'mock-standalone',
    guilds: ReadonlyArray<Snowflake> | null = null,
    type: number = ApplicationCommandType.ChatInput,
  ) {
    super();
    this.data = {
      name,
      description: 'Mock command',
      type,
    } as RESTPostAPIChatInputApplicationCommandsJSONBody;
    this.guilds = guilds;
  }

  public override getGuilds(): ReadonlyArray<Snowflake> | null {
    return this.guilds;
  }
}
