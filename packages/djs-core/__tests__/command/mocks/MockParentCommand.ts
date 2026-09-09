import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from '@discordjs/core';
import { AbstractParentCommand } from '../../../src';

export class MockParentCommand extends AbstractParentCommand {
  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(name = 'mock-parent') {
    super();
    this.data = {
      name,
      description: 'Mock parent command',
    };
  }
}
