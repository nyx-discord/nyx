import type { ParentCommand } from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandGroupOption } from 'discord-api-types/v10';
import { AbstractSubCommandGroup } from '../../../src';
import type { DjsInteractionTypes } from '../../../src/types/DjsInteractionTypes.js';

export class MockSubCommandGroup extends AbstractSubCommandGroup {
  protected readonly data: APIApplicationCommandSubcommandGroupOption;

  constructor(parent: ParentCommand<DjsInteractionTypes>, name = 'mock-group') {
    super(parent);
    this.data = {
      name,
      description: 'Mock subcommand group',
    } as APIApplicationCommandSubcommandGroupOption;
  }
}
