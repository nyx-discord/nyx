import { vi } from 'vitest';
import type {
  Metadata,
  ParentCommand,
  SubCommandData,
  SubCommandGroup,
} from '../../../src';
import { BaseSubCommand } from '../../../src';
import { MockParentCommand } from './MockParentCommand';
import { MockSubCommandGroup } from './MockSubCommandGroup';

export class MockSubCommand extends BaseSubCommand {
  public execute = vi.fn();

  protected readonly data: SubCommandData;

  constructor(parent: ParentCommand | SubCommandGroup, name?: string) {
    super(parent);
    this.data = {
      name: name ?? 'mock-subcommand',
      description: 'Mock subcommand',
    };
  }

  public static createOnGroup() {
    const parent = new MockParentCommand();
    const group = new MockSubCommandGroup(parent);
    return new MockSubCommand(group);
  }

  public static createOnParent() {
    const parent = new MockParentCommand();
    return new MockSubCommand(parent);
  }

  public async handleInteraction(
    _interaction: unknown,
    _meta: Metadata,
  ): Promise<void> {}
}
