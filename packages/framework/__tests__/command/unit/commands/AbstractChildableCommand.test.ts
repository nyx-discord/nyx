import {
  AssertionError,
  IllegalDuplicateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import { describe, expect, test } from 'vitest';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubcommandGroup';

describe('AbstractChildableCommand', () => {
  describe('addChildren', () => {
    test('GIVEN a valid child THEN adds it successfully', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);

      parent.addChildren(subcommand);

      expect(parent.size).toBe(1);
      expect(parent.findChildByName(subcommand.getData().name)).toBe(
        subcommand,
      );
    });

    test('GIVEN a child with wrong parent THEN throws AssertionError', () => {
      const parent = new MockParentCommand();
      const otherParent = new MockParentCommand();
      const subcommand = new MockSubCommand(otherParent);

      expect(() => parent.addChildren(subcommand)).toThrow(AssertionError);
    });

    test('GIVEN a duplicate child name THEN throws IllegalDuplicateError', () => {
      const parent = new MockParentCommand();
      const subcommand1 = new MockSubCommand(parent);
      const subcommand2 = new MockSubCommand(parent);

      parent.addChildren(subcommand1);

      expect(() => parent.addChildren(subcommand2)).toThrow(
        IllegalDuplicateError,
      );
    });

    test('GIVEN children that exceed the child limit THEN throws RangeError', () => {
      const parent = new MockParentCommand();
      const childLimit = parent.getMaxChildren();

      for (let i = 0; i < childLimit; i++) {
        const subcommand = new MockSubCommand(parent, `sub-${i}`);
        parent.addChildren(subcommand);
      }

      expect(() => parent.addChildren(new MockSubCommand(parent, 'overflow'))).toThrow(
        RangeError,
      );
    });

    test('GIVEN multiple children THEN they are all added', () => {
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      const subcommand1 = new MockSubCommand(parent, 'sub-1');
      const subcommand2 = new MockSubCommand(parent, 'sub-2');

      parent.addChildren(group, subcommand1, subcommand2);

      expect(parent.size).toBe(3);
    });
  });

  describe('removeChildByName', () => {
    test('GIVEN an existing child name THEN removes it', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      parent.removeChildByName(subcommand.getData().name);

      expect(parent.size).toBe(0);
      expect(parent.findChildByName(subcommand.getData().name)).toBeNull();
    });

    test('GIVEN a non-existing child name THEN throws ObjectNotFoundError', () => {
      const parent = new MockParentCommand();

      expect(() => parent.removeChildByName('nonexistent')).toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('removeChildByInstance', () => {
    test('GIVEN an existing child instance THEN removes it', () => {
      const parent = new MockParentCommand();
      const subcommand1 = new MockSubCommand(parent, 'sub-1');
      const subcommand2 = new MockSubCommand(parent, 'sub-2');
      parent.addChildren(subcommand1, subcommand2);

      parent.removeChildByInstance(subcommand1);

      expect(parent.size).toBe(1);
      expect(parent.findChildByName('sub-1')).toBeNull();
      expect(parent.findChildByName('sub-2')).toBe(subcommand2);
    });

    test('GIVEN only one child THEN throws RangeError', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      expect(() => parent.removeChildByInstance(subcommand)).toThrow(
        RangeError,
      );
    });

    test('GIVEN a non-existing child instance THEN throws ObjectNotFoundError', () => {
      const parent = new MockParentCommand();
      const subcommand1 = new MockSubCommand(parent, 'sub-1');
      const subcommand2 = new MockSubCommand(parent, 'sub-2');
      parent.addChildren(subcommand1, subcommand2);

      const otherParent = new MockParentCommand();
      const otherSubcommand = new MockSubCommand(otherParent, 'other');

      expect(() => parent.removeChildByInstance(otherSubcommand)).toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('findChildByClass', () => {
    test('GIVEN children of a specific class THEN finds the first match', () => {
      const parent = new MockParentCommand();
      const group1 = new MockSubCommandGroup(parent, 'group-1');
      const group2 = new MockSubCommandGroup(parent, 'group-2');
      parent.addChildren(group1, group2);

      const found = parent.findChildByClass(MockSubCommandGroup);
      expect(found).toBe(group1);
    });

    test('GIVEN no child of that class THEN returns null', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      const found = parent.findChildByClass(MockSubCommandGroup);
      expect(found).toBeNull();
    });
  });

  describe('findChildByName', () => {
    test('GIVEN an existing child name THEN returns the child', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent, 'my-subcommand');
      parent.addChildren(subcommand);

      const found = parent.findChildByName('my-subcommand');
      expect(found).toBe(subcommand);
    });

    test('GIVEN a non-existing child name THEN returns null', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      const found = parent.findChildByName('nonexistent');
      expect(found).toBeNull();
    });
  });

  describe('getMaxChildren', () => {
    test('GIVEN a parent command THEN returns 25', () => {
      const parent = new MockParentCommand();
      expect(parent.getMaxChildren()).toBe(25);
    });

    test('GIVEN a subcommand group THEN returns 25', () => {
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      expect(group.getMaxChildren()).toBe(25);
    });
  });

  describe('getChildren', () => {
    test('GIVEN children added THEN returns the collection', () => {
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      const children = parent.getChildren();
      expect(children.size).toBe(1);
      expect(children.has(subcommand.getData().name)).toBe(true);
    });
  });

  describe('size', () => {
    test('GIVEN no children THEN size is 0', () => {
      const parent = new MockParentCommand();
      expect(parent.size).toBe(0);
    });

    test('GIVEN children added THEN size reflects the count', () => {
      const parent = new MockParentCommand();
      const subcommand1 = new MockSubCommand(parent, 'sub-1');
      const subcommand2 = new MockSubCommand(parent, 'sub-2');
      parent.addChildren(subcommand1, subcommand2);

      expect(parent.size).toBe(2);
    });
  });
});
