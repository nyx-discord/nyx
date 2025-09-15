import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { vi } from 'vitest';
import { AbstractStandaloneCommand } from '../../../src';

export class MockStandaloneCommand extends AbstractStandaloneCommand {
  public execute = vi.fn();

  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(name?: string) {
    super();
    this.data = new SlashCommandBuilder()
      .setName(name ?? 'mock-standalone')
      .setDescription('Mock command')
      .toJSON();
  }
}
