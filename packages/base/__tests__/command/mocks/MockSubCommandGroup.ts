import type { ParentCommand, SubCommandGroupData } from '../../../src';
import { BaseSubCommandGroup } from '../../../src';

export class MockSubCommandGroup extends BaseSubCommandGroup {
  protected readonly data: SubCommandGroupData;

  constructor(parent: ParentCommand, name?: string) {
    super(parent);
    this.data = {
      name: name ?? 'mock-subcommand-group',
      description: 'Mock subcommand group',
    };
  }
}
