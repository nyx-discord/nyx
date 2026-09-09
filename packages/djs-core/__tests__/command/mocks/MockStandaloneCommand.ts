import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from '@discordjs/core';
import { ApplicationCommandType } from '@discordjs/core';
import { vi } from 'vitest';
import { AbstractStandaloneCommand } from '../../../src';

export class MockStandaloneCommand extends AbstractStandaloneCommand {
  public execute = vi.fn();

  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  protected readonly guilds: ReadonlyArray<Snowflake> | null;

  constructor(
    name = 'mock-standalone',
    guilds: ReadonlyArray<Snowflake> | null = null,
  ) {
    super();
    this.data = {
      name,
      description: 'Mock command',
      type: ApplicationCommandType.ChatInput,
    };
    this.guilds = guilds;
  }

  public override getGuilds(): ReadonlyArray<Snowflake> | null {
    return this.guilds;
  }
}
