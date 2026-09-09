import type { ParentCommand } from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandGroupOption } from 'discord-api-types/v10';
import { BaseSubCommandGroup } from '../../../src';

export class MockSubCommandGroup extends BaseSubCommandGroup {
  protected readonly data: APIApplicationCommandSubcommandGroupOption;

  constructor(parent: ParentCommand, name?: string) {
    super(parent);
    this.data = {
      name: name ?? 'mock-subcommand-group',
      description: 'Mock subcommand group',
    } as APIApplicationCommandSubcommandGroupOption;
  }
}
