import type { APIApplicationCommandSubcommandOption } from '@discordjs/core';
import { ApplicationCommandOptionType } from '@discordjs/core';
import { vi } from 'vitest';
import type {
  CoreInteractionTypes,
  ParentCommand,
  SubCommandGroup,
} from '../../../src';
import { AbstractSubCommand } from '../../../src';

export class MockSubCommand extends AbstractSubCommand {
  public execute = vi.fn();

  protected readonly data: APIApplicationCommandSubcommandOption;

  constructor(
    parent:
      | ParentCommand<CoreInteractionTypes>
      | SubCommandGroup<CoreInteractionTypes>,
    name = 'mock-subcommand',
  ) {
    super(parent);
    this.data = {
      name,
      description: 'Mock subcommand',
      type: ApplicationCommandOptionType.Subcommand,
    };
  }
}
