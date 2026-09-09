import type { ParentCommand } from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandGroupOption } from 'discord-api-types/v10';
import { AbstractSubCommandGroup } from '../../../src';
import type { CoreInteractionTypes } from '../../../src/types/CoreInteractionTypes.js';

export class MockSubCommandGroup extends AbstractSubCommandGroup {
  protected readonly data: APIApplicationCommandSubcommandGroupOption;

  constructor(parent: ParentCommand<CoreInteractionTypes>, name = 'mock-group') {
    super(parent);
    this.data = {
      name,
      description: 'Mock subcommand group',
    } as APIApplicationCommandSubcommandGroupOption;
  }
}
