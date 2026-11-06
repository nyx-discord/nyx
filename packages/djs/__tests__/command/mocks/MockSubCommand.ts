import type { ParentCommand, SubCommandGroup } from '@nyx-discord/base';
import type { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';
import { vi } from 'vitest';
import type { DjsInteractionTypes } from '../../../src';
import { AbstractSubCommand } from '../../../src';

export class MockSubCommand extends AbstractSubCommand {
  public execute = vi.fn();

  protected readonly data: APIApplicationCommandSubcommandOption;

  constructor(
    parent:
      ParentCommand<DjsInteractionTypes> | SubCommandGroup<DjsInteractionTypes>,
    name = 'mock-subcommand',
  ) {
    super(parent);
    this.data = {
      name,
      description: 'Mock subcommand',
    } as APIApplicationCommandSubcommandOption;
  }
}
