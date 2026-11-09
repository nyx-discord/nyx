import { describe, expect, test } from 'vitest';
import { getCommandNameTree } from '../../../../src';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubCommandGroup';

describe('getCommandNameTree', () => {
  test('GIVEN a standalone command THEN name tree is [name]', () => {
    const command = new MockStandaloneCommand('my-command');
    expect(getCommandNameTree(command)).toEqual(['my-command']);
  });

  test('GIVEN a command hierarchy THEN returns the full name path for each level', () => {
    const parent = new MockParentCommand('admin');
    const directSub = new MockSubCommand(parent, 'status');
    const roleGroup = new MockSubCommandGroup(parent, 'roles');
    const assignSub = new MockSubCommand(roleGroup, 'assign');

    roleGroup.addChildren(assignSub);
    parent.addChildren(directSub, roleGroup);

    expect(getCommandNameTree(parent)).toEqual(['admin']);
    expect(getCommandNameTree(directSub)).toEqual(['admin', 'status']);
    expect(getCommandNameTree(roleGroup)).toEqual(['admin', 'roles']);
    expect(getCommandNameTree(assignSub)).toEqual(['admin', 'roles', 'assign']);
  });
});
