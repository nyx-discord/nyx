import { StubBot } from '#mocks/StubBot';
import { beforeEach, describe, expect, test } from 'vitest';
import { LoaderError } from '../../src';
import { ObjectInstantiator } from '../../src/util/ObjectInstantiator';

class ClassWithCreate {
  public static createCalls: Array<{ bot: unknown; parent?: unknown }> = [];
  private static nextId = 0;
  instanceId: number;
  parentArg?: unknown;

  constructor(parent?: unknown) {
    this.instanceId = ClassWithCreate.nextId++;
    this.parentArg = parent;
  }

  public static create(bot: unknown, parent?: unknown): ClassWithCreate {
    ClassWithCreate.createCalls.push({ bot, parent });
    return new ClassWithCreate(parent);
  }

  public static reset(): void {
    ClassWithCreate.createCalls = [];
    ClassWithCreate.nextId = 0;
  }
}

class ZeroArgClass {
  constructor() {}
}

class OneArgClass {
  parent: unknown;
  constructor(parent: unknown) {
    this.parent = parent;
  }
}

class TwoArgClass {
  constructor(_a: unknown, _b: unknown) {}
}

class ThrowingCreateClass {
  public static create(_bot: unknown): never {
    throw new Error('create failed');
  }
}

class ThrowingConstructorClass {
  constructor() {
    throw new Error('constructor failed');
  }
}

describe('ObjectInstantiator.instantiateModule', () => {
  const bot = StubBot.create();

  beforeEach(() => {
    ClassWithCreate.reset();
  });

  describe('top-level (no parent)', () => {
    test('GIVEN a class with static create THEN calls create(bot) and returns the instance', () => {
      const instance = ObjectInstantiator.instantiateModule(
        ClassWithCreate,
        bot,
      );
      expect(instance).toBeInstanceOf(ClassWithCreate);
      expect(ClassWithCreate.createCalls).toHaveLength(1);
      expect(ClassWithCreate.createCalls[0]?.bot).toBe(bot);
      expect(ClassWithCreate.createCalls[0]?.parent).toBeUndefined();
    });

    test('GIVEN a class with 0 constructor args and no create THEN calls new Class()', () => {
      const instance = ObjectInstantiator.instantiateModule(ZeroArgClass, bot);
      expect(instance).toBeInstanceOf(ZeroArgClass);
    });

    test('GIVEN a class with many constructor args and no create THEN throws LoaderError', () => {
      expect(() =>
        ObjectInstantiator.instantiateModule(TwoArgClass, bot),
      ).toThrow(LoaderError);
    });

    test('GIVEN static create throws THEN throws LoaderError with cause', () => {
      try {
        ObjectInstantiator.instantiateModule(ThrowingCreateClass, bot);
        throw new Error('should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(LoaderError);
        expect((error as LoaderError).cause).toBeInstanceOf(Error);
        expect((error as LoaderError).reason).toContain(
          'Failed to instantiate',
        );
      }
    });
  });

  describe('child (with parent)', () => {
    const parent = { name: 'parent-instance' };

    test('GIVEN a class with static create THEN calls create(bot, parent) and returns the instance', () => {
      const instance = ObjectInstantiator.instantiateModule(
        ClassWithCreate,
        bot,
        parent,
      );
      expect(instance).toBeInstanceOf(ClassWithCreate);
      expect(ClassWithCreate.createCalls).toHaveLength(1);
      expect(ClassWithCreate.createCalls[0]?.bot).toBe(bot);
      expect(ClassWithCreate.createCalls[0]?.parent).toBe(parent);
    });

    test('GIVEN a class with 1 constructor arg and no create THEN calls new Class(parent)', () => {
      const instance = ObjectInstantiator.instantiateModule(
        OneArgClass,
        bot,
        parent,
      );
      expect(instance).toBeInstanceOf(OneArgClass);
      expect(instance.parent).toBe(parent);
    });

    test('GIVEN a class with 0 constructor args and no create THEN throws LoaderError', () => {
      expect(() =>
        ObjectInstantiator.instantiateModule(ZeroArgClass, bot, parent),
      ).toThrow(LoaderError);
    });

    test('GIVEN a class with many constructor args and no create THEN throws LoaderError', () => {
      expect(() =>
        ObjectInstantiator.instantiateModule(TwoArgClass, bot, parent),
      ).toThrow(LoaderError);
    });

    test('GIVEN constructor throws THEN throws LoaderError', () => {
      expect(() =>
        ObjectInstantiator.instantiateModule(
          ThrowingConstructorClass,
          bot,
          parent,
        ),
      ).toThrow(LoaderError);
    });
  });
});
