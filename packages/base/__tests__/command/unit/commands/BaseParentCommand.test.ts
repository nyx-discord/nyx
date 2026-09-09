import { describe, expect, test } from 'vitest';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubCommandGroup';

describe('BaseParentCommand (Discord Payload Assembly & Hierarchy)', () => {
  describe('getData() payload assembly', () => {
    test('GIVEN an empty parent command WHEN getData is called THEN produces payload with empty options array', () => {
      const parent = new MockParentCommand('settings');

      const data = parent.getData();

      expect(data).toEqual({
        name: 'settings',
        description: 'Mock command',
        options: [],
      });
    });

    test('GIVEN a parent with direct subcommands WHEN getData is called THEN payload options contain subcommand data', () => {
      const parent = new MockParentCommand('config');
      const viewSub = new MockSubCommand(parent, 'view');
      const setSub = new MockSubCommand(parent, 'set');

      parent.addChildren(viewSub, setSub);

      const data = parent.getData();

      expect(data).toEqual({
        name: 'config',
        description: 'Mock command',
        options: [
          { name: 'view', description: 'Mock subcommand' },
          { name: 'set', description: 'Mock subcommand' },
        ],
      });
    });

    test('GIVEN a parent with a subcommand group WHEN getData is called THEN nests subcommands inside the group options', () => {
      const parent = new MockParentCommand('admin');
      const userGroup = new MockSubCommandGroup(parent, 'users');
      const addSub = new MockSubCommand(userGroup, 'add');
      const removeSub = new MockSubCommand(userGroup, 'remove');

      userGroup.addChildren(addSub, removeSub);
      parent.addChildren(userGroup);

      const data = parent.getData();

      expect(data).toEqual({
        name: 'admin',
        description: 'Mock command',
        options: [
          {
            name: 'users',
            description: 'Mock subcommand group',
            options: [
              { name: 'add', description: 'Mock subcommand' },
              { name: 'remove', description: 'Mock subcommand' },
            ],
          },
        ],
      });
    });

    test('GIVEN a 3-tier hierarchy with multiple groups and direct subcommands WHEN getData is called THEN builds the complete nested Discord payload', () => {
      const parent = new MockParentCommand('system');

      // Direct subcommand
      const pingSub = new MockSubCommand(parent, 'ping');

      // Group 1: logs
      const logsGroup = new MockSubCommandGroup(parent, 'logs');
      const viewLogsSub = new MockSubCommand(logsGroup, 'view');
      const clearLogsSub = new MockSubCommand(logsGroup, 'clear');
      logsGroup.addChildren(viewLogsSub, clearLogsSub);

      // Group 2: database
      const dbGroup = new MockSubCommandGroup(parent, 'database');
      const backupSub = new MockSubCommand(dbGroup, 'backup');
      dbGroup.addChildren(backupSub);

      parent.addChildren(pingSub, logsGroup, dbGroup);

      const data = parent.getData();

      expect(data).toEqual({
        name: 'system',
        description: 'Mock command',
        options: [
          { name: 'ping', description: 'Mock subcommand' },
          {
            name: 'logs',
            description: 'Mock subcommand group',
            options: [
              { name: 'view', description: 'Mock subcommand' },
              { name: 'clear', description: 'Mock subcommand' },
            ],
          },
          {
            name: 'database',
            description: 'Mock subcommand group',
            options: [{ name: 'backup', description: 'Mock subcommand' }],
          },
        ],
      });
    });
  });

  describe('getNameTree() hierarchy resolution', () => {
    test('GIVEN a command hierarchy WHEN getNameTree is called THEN returns the full name path for each level', () => {
      const parent = new MockParentCommand('admin');
      const directSub = new MockSubCommand(parent, 'status');
      const roleGroup = new MockSubCommandGroup(parent, 'roles');
      const assignSub = new MockSubCommand(roleGroup, 'assign');

      roleGroup.addChildren(assignSub);
      parent.addChildren(directSub, roleGroup);

      expect(parent.getNameTree()).toEqual(['admin']);
      expect(directSub.getNameTree()).toEqual(['admin', 'status']);
      expect(roleGroup.getNameTree()).toEqual(['admin', 'roles']);
      expect(assignSub.getNameTree()).toEqual(['admin', 'roles', 'assign']);
    });
  });

  describe('identity and metadata', () => {
    test('GIVEN a parent command THEN isParent returns true, getId returns command name, and getGuilds returns null', () => {
      const parent = new MockParentCommand('mod');

      expect(parent.isParent()).toBe(true);
      expect(parent.getId()).toBe('mod');
      expect(parent.getGuilds()).toBeNull();
    });
  });
});
