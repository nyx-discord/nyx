import { describe, expect, it, test } from 'vitest';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubcommandGroup';

describe('AbstractCommand type guards', () => {
  describe('MockStandaloneCommand', () => {
    const command = new MockStandaloneCommand();

    it('SHOULD be standalone', () => {
      expect(command.isStandalone()).toBe(true);
    });

    it('SHOULD NOT be parent', () => {
      expect(command.isParent()).toBe(false);
    });

    it('SHOULD NOT be subcommand', () => {
      expect(command.isSubCommand()).toBe(false);
    });

    it('SHOULD NOT be subcommand group', () => {
      expect(command.isSubCommandGroup()).toBe(false);
    });

    it('SHOULD NOT be context menu', () => {
      expect(command.isContextMenu()).toBe(false);
    });
  });

  describe('MockParentCommand', () => {
    const command = new MockParentCommand();

    it('SHOULD NOT be standalone', () => {
      expect(command.isStandalone()).toBe(false);
    });

    it('SHOULD be parent', () => {
      expect(command.isParent()).toBe(true);
    });

    it('SHOULD NOT be subcommand', () => {
      expect(command.isSubCommand()).toBe(false);
    });

    it('SHOULD NOT be subcommand group', () => {
      expect(command.isSubCommandGroup()).toBe(false);
    });

    it('SHOULD NOT be context menu', () => {
      expect(command.isContextMenu()).toBe(false);
    });
  });

  describe('MockSubCommand', () => {
    const parent = new MockParentCommand();
    const command = new MockSubCommand(parent);

    it('SHOULD NOT be standalone', () => {
      expect(command.isStandalone()).toBe(false);
    });

    it('SHOULD NOT be parent', () => {
      expect(command.isParent()).toBe(false);
    });

    it('SHOULD be subcommand', () => {
      expect(command.isSubCommand()).toBe(true);
    });

    it('SHOULD NOT be subcommand group', () => {
      expect(command.isSubCommandGroup()).toBe(false);
    });

    it('SHOULD NOT be context menu', () => {
      expect(command.isContextMenu()).toBe(false);
    });
  });

  describe('MockSubCommandGroup', () => {
    const parent = new MockParentCommand();
    const command = new MockSubCommandGroup(parent);

    it('SHOULD NOT be standalone', () => {
      expect(command.isStandalone()).toBe(false);
    });

    it('SHOULD NOT be parent', () => {
      expect(command.isParent()).toBe(false);
    });

    it('SHOULD NOT be subcommand', () => {
      expect(command.isSubCommand()).toBe(false);
    });

    it('SHOULD be subcommand group', () => {
      expect(command.isSubCommandGroup()).toBe(true);
    });

    it('SHOULD NOT be context menu', () => {
      expect(command.isContextMenu()).toBe(false);
    });
  });

  describe('getData', () => {
    test('GIVEN a standalone command THEN getData returns its data', () => {
      const command = new MockStandaloneCommand();
      expect(command.getData().name).toBe('mock-standalone');
      expect(command.getData().description).toBe('Mock command');
    });

    test('GIVEN a parent command THEN getData returns its data', () => {
      const command = new MockParentCommand();
      expect(command.getData().name).toBe('mock-parent');
    });

    test('GIVEN a subcommand THEN getData returns its data', () => {
      const parent = new MockParentCommand();
      const command = new MockSubCommand(parent);
      expect(command.getData().name).toBe('mock-subcommand');
    });
  });

  describe('getMeta', () => {
    test('GIVEN a command THEN getMeta returns a metadata object', () => {
      const command = new MockStandaloneCommand();
      const meta = command.getMeta();

      expect(meta).toBeDefined();
      expect(typeof meta).toBe('object');
    });
  });

  describe('getNameTree', () => {
    test('GIVEN a standalone command THEN name tree is [name]', () => {
      const command = new MockStandaloneCommand('my-command');
      expect(command.getNameTree()).toEqual(['my-command']);
    });

    test('GIVEN a parent command THEN name tree is [name]', () => {
      const command = new MockParentCommand('my-parent');
      expect(command.getNameTree()).toEqual(['my-parent']);
    });

    test('GIVEN a subcommand under parent THEN name tree is [parent, sub]', () => {
      const parent = new MockParentCommand('my-parent');
      const command = new MockSubCommand(parent, 'my-sub');
      expect(command.getNameTree()).toEqual(['my-parent', 'my-sub']);
    });

    test('GIVEN a subcommand group THEN name tree is [parent, group]', () => {
      const parent = new MockParentCommand('my-parent');
      const command = new MockSubCommandGroup(parent, 'my-group');
      expect(command.getNameTree()).toEqual(['my-parent', 'my-group']);
    });
  });
});
