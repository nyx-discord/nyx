import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubCommandGroup';

describe('BaseSubCommandGroup (getData)', () => {
  test('GIVEN data without a type WHEN getData is called THEN adds the subcommand group type', () => {
    const group = new MockSubCommandGroup(new MockParentCommand(), 'users');

    expect(group.getData()).toEqual({
      name: 'users',
      description: 'Mock subcommand group',
      type: ApplicationCommandOptionType.SubcommandGroup,
    });
  });
});
