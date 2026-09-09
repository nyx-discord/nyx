import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { AbstractParentCommand } from '../../../src';

export class MockParentCommand extends AbstractParentCommand {
  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(name = 'mock-parent') {
    super();
    this.data = {
      name,
      description: 'Mock parent command',
    } as RESTPostAPIChatInputApplicationCommandsJSONBody;
  }
}
