import type { APIApplicationCommandSubcommandGroupOption } from '@discordjs/core';
import type { ParentCommand } from '@nyx-discord/types';
import type { CoreInteractionTypes } from '../../../src';
import { AbstractSubCommandGroup } from '../../../src';

export class MockSubCommandGroup extends AbstractSubCommandGroup {
  protected readonly data: APIApplicationCommandSubcommandGroupOption;

  constructor(
    parent: ParentCommand<CoreInteractionTypes>,
    name = 'mock-group',
  ) {
    super(parent);
    this.data = {
      name,
      description: 'Mock subcommand group',
    } as APIApplicationCommandSubcommandGroupOption;
  }
}
