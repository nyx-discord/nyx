import type { ParentCommand } from '@nyx-discord/base';
import type { APIApplicationCommandSubcommandGroupOption } from 'discord.js';
import type { DjsInteractionTypes } from '../../../src';
import { AbstractSubCommandGroup } from '../../../src';

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
