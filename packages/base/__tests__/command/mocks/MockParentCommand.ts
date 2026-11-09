import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { BaseParentCommand } from '../../../src';

export class MockParentCommand extends BaseParentCommand {
  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(name?: string) {
    super();
    this.data = { name: name ?? 'mock-parent', description: 'Mock command' };
  }
}
