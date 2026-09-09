import type {
  Metadata,
  ParentCommand,
  SubCommandGroup,
} from '@nyx-discord/types';
import type { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';
import { vi } from 'vitest';
import { BaseSubCommand } from '../../../src';
import { MockParentCommand } from './MockParentCommand';
import { MockSubCommandGroup } from './MockSubCommandGroup';

export class MockSubCommand extends BaseSubCommand {
  public execute = vi.fn();

  protected readonly data: APIApplicationCommandSubcommandOption;

  constructor(parent: ParentCommand | SubCommandGroup, name?: string) {
    super(parent);
    this.data = {
      name: name ?? 'mock-subcommand',
      description: 'Mock subcommand',
    } as APIApplicationCommandSubcommandOption;
  }

  public async handleInteraction(
    _interaction: unknown,
    _meta: Metadata,
  ): Promise<void> {}

  public static createOnGroup() {
    const parent = new MockParentCommand();
    const group = new MockSubCommandGroup(parent);
    return new MockSubCommand(group);
  }

  public static createOnParent() {
    const parent = new MockParentCommand();
    return new MockSubCommand(parent);
  }
}
