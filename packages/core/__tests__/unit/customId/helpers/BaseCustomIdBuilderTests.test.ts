import type { CustomIdBuilder, CustomIdBuilderOptions } from '../../../../src';

const separator = '-';
const values = ['abc', 'def', 'ghi'] as const;

export function runBaseTests<
  const Builder extends CustomIdBuilder & { clone(): Builder },
>(builderFactory: (options: CustomIdBuilderOptions) => Builder) {
  describe('WHEN instantiating without tokens', () => {
    let builder: Builder;

    beforeEach(() => {
      builder = builderFactory({ separator });
    });

    test('THEN the separator should be set', () => {
      expect(builder.getSeparator()).toEqual(separator);
    });

    test('THEN the tokens array should be empty', () => {
      expect(builder.getTokens()).toEqual([]);
    });
  });

  describe('WHEN instantiating with tokens', () => {
    let builder: Builder;

    beforeEach(() => {
      builder = builderFactory({ separator, tokens: [...values] });
    });

    test('THEN the tokens array should equal the values', () => {
      expect(builder.getTokens()).toEqual(values);
    });
  });

  describe('WHEN using #push() with one value', () => {
    let builder: Builder;
    const value = values[0];

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.push(value);
    });

    test('THEN the tokens array should equal the value', () => {
      expect(builder.getTokens()).toEqual([value]);
    });
  });

  describe('WHEN using #push() with multiple values', () => {
    let builder: Builder;

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.push(...values);
    });

    test('THEN the tokens array should contain all values', () => {
      expect(builder.getTokens()).toEqual(values);
    });
  });

  describe('WHEN using #clonePush() with a single value', () => {
    let builder: Builder;
    let clone: Builder;

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.push(...values);
      clone = builder.clonePush('abc');
    });

    test('THEN the clone should have the same tokens as the original, and the pushed value', () => {
      expect(clone.getTokens()).toEqual([...builder.getTokens(), 'abc']);
    });
  });

  describe('WHEN using #clonePush() with multiple values', () => {
    let builder: Builder;
    let clone: Builder;

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.push(...values);
      clone = builder.clonePush(...values);
    });

    test('THEN the clone should have the same tokens as the original, and the pushed values', () => {
      expect(clone.getTokens()).toEqual([...builder.getTokens(), ...values]);
    });
  });

  describe('WHEN using #push() with a string containing the separator', () => {
    let builder;

    beforeEach(() => {
      builder = builderFactory({ separator });
    });

    test('THEN it should throw an error', () => {
      expect(() => builder.push(`abc${separator}def`)).toThrow();
    });
  });

  describe('WHEN using #clone()', () => {
    let builder: Builder;
    let clone: Builder | CustomIdBuilder;

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.push(...values);
      clone = builder.clone();
    });

    test('THEN the clone should be a new instance', () => {
      expect(clone).not.toBe(builder);
    });

    test('THEN the clone should be of the same class as the original', () => {
      expect(clone.constructor).toBe(builder.constructor);
    });

    test('THEN the clone should have the same tokens as the original', () => {
      expect(clone.getTokens()).toEqual(builder.getTokens());
    });

    test('THEN the clone should have the same separator as the original', () => {
      expect(clone.getSeparator()).toEqual(builder.getSeparator());
    });

    test('THEN changes to the clone should not affect the original', () => {
      clone.push('def');
      expect(builder.getTokens()).not.toEqual(clone.getTokens());
    });
  });

  describe('WHEN using #setAt()', () => {
    let builder: Builder;
    const index = 0;
    const value = values[index];

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.setAt(index, value);
    });

    test('THEN the token at the provided index should be the new value', () => {
      expect(builder.getTokens()[index]).toEqual(value);
    });

    test('THEN setting at the same index should throw an error', () => {
      expect(() => builder.setAt(index, value)).toThrow();
    });
  });

  describe('WHEN using #cloneSetAt()', () => {
    let builder: Builder;
    let clone: Builder;

    const index = values.length;
    const string = 'xyz';

    beforeEach(() => {
      builder = builderFactory({ separator });
      builder.push(...values);
      clone = builder.cloneSetAt(index, string);
    });

    test('THEN the clone should have the same tokens as the original, and the new value', () => {
      expect(clone.getTokens()).toEqual([...builder.getTokens(), string]);
    });
  });

  describe('WHEN instantiating with .fromString()', () => {
    let builder: Builder;
    const string = `123${separator}456${separator}789`;

    beforeEach(() => {
      builder = (
        builderFactory({ separator }).constructor as typeof CustomIdBuilder
      ).fromString(string, separator) as Builder;
    });

    test('THEN the tokens array should equal the string, split by the separator', () => {
      expect(builder.getTokens()).toEqual(string.split(separator));
    });
  });
}
