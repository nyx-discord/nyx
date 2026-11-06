import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { vi } from 'vitest';
import type { Metadata } from '../../../src';
import { BaseStandaloneCommand } from '../../../src';

export class MockStandaloneCommand extends BaseStandaloneCommand {
  public execute = vi.fn();

  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(name?: string) {
    super();
    this.data = {
      name: name ?? 'mock-standalone',
      description: 'Mock command',
    };
  }

  public async handleInteraction(
    _interaction: unknown,
    _meta: Metadata,
  ): Promise<void> {}
}
