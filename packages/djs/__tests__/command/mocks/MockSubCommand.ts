import type { ParentCommand, SubCommandGroup } from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';
import { vi } from 'vitest';
import { AbstractSubCommand } from '../../../src';
import type { DjsInteractionTypes } from '../../../src/types/DjsInteractionTypes.js';

export class MockSubCommand extends AbstractSubCommand {
  public execute = vi.fn();

  protected readonly data: APIApplicationCommandSubcommandOption;

  constructor(
    parent:
      | ParentCommand<DjsInteractionTypes>
      | SubCommandGroup<DjsInteractionTypes>,
    name = 'mock-subcommand',
  ) {
    super(parent);
    this.data = {
      name,
      description: 'Mock subcommand',
    } as APIApplicationCommandSubcommandOption;
  }
}
