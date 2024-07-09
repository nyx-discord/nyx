import type {
  MetadatableCustomIdBuilder,
  MetadatableCustomIdBuilderOptions,
} from '../../../../src';

const values = ['meta1', 'meta2', 'meta3'] as const;

const namespace = 'TEST';
const objectId = 'myObject';
const separator = '-';
const metadataSeparator = '|';

export function runMetadatableTests<
  const Builder extends MetadatableCustomIdBuilder & { clone(): Builder },
>(builderFactory: (options: MetadatableCustomIdBuilderOptions) => Builder) {
  describe('WHEN instantiating', () => {
    let builder: Builder;

    beforeEach(() => {
      builder = builderFactory({
        namespace,
        objectId,
        separator,
        metadataSeparator: metadataSeparator,
      });
    });

    test('THEN the namespace is set', () => {
      expect(builder.getNamespace()).toBe(namespace);
    });

    test('THEN the objectId is set', () => {
      expect(builder.getObjectId()).toBe(objectId);
    });

    test('THEN the separator is set', () => {
      expect(builder.getSeparator()).toBe(separator);
    });

    test('THEN the dataSeparator is set', () => {
      expect(builder.getMetadataSeparator()).toBe(metadataSeparator);
    });

    test('THEN the metadata is empty', () => {
      expect(builder.getMetadata()).toHaveLength(0);
    });
  });

  describe('WHEN instantiating and the separator is the same as the metadata separator', () => {
    test('THEN an error should be thrown', () => {
      expect(() =>
        builderFactory({
          namespace,
          objectId,
          separator: metadataSeparator,
          metadataSeparator: metadataSeparator,
        }),
      ).toThrow();
    });
  });

  describe('WHEN using #pushMeta() with one value', () => {
    let builder: Builder;
    let index: number;
    const value = values[0];

    beforeEach(() => {
      builder = builderFactory({
        namespace,
        objectId,
        separator,
        metadataSeparator: metadataSeparator,
      });
      index = builder.pushMeta(value);
    });

    test('THEN the metadata array at the returned index should equal the value', () => {
      expect(builder.getMetadata()[index]).toEqual(value);
    });

    test('THEN using #getMetaAt() at the returned index should return the value', () => {
      expect(builder.getMetaAt(index)).toEqual(value);
    });
  });

  describe('WHEN using #pushMeta() with multiple values', () => {
    let builder: Builder;
    let index: number;
    const values = ['meta1', 'meta2', 'meta3'] as const;

    beforeEach(() => {
      builder = builderFactory({
        namespace,
        objectId,
        separator,
        metadataSeparator: metadataSeparator,
      });
      index = builder.pushMeta(...values);
    });

    test('THEN the metadata array, beginning at the returned index, should equal the values', () => {
      expect(builder.getMetadata().slice(index, index + values.length)).toEqual(
        values,
      );
    });

    test('THEN using #getMetaAt() for each index beginning at the returned index, should return the value', () => {
      expect(builder.getMetaAt(index)).toEqual(values[0]);
      expect(builder.getMetaAt(index + 1)).toEqual(values[1]);
      expect(builder.getMetaAt(index + 2)).toEqual(values[2]);
    });
  });

  describe('WHEN using #pushMeta() with a value that contains the separator', () => {
    test('THEN an error should be thrown', () => {
      expect(() =>
        builderFactory({
          namespace,
          objectId,
          separator,
          metadataSeparator: metadataSeparator,
        }).pushMeta(`abc${separator}def`),
      ).toThrow();
    });
  });

  describe('WHEN using #pushMeta() with a value that contains the metadata separator', () => {
    test('THEN an error should be thrown', () => {
      expect(() =>
        builderFactory({
          namespace,
          objectId,
          separator,
          metadataSeparator: metadataSeparator,
        }).pushMeta(`abc${metadataSeparator}def`),
      ).toThrow();
    });
  });

  describe('WHEN using #setMetaAt() with a value that contains the separator', () => {
    test('THEN an error should be thrown', () => {
      expect(() =>
        builderFactory({
          namespace,
          objectId,
          separator,
          metadataSeparator: metadataSeparator,
        }).setMetaAt(0, `abc${separator}def`),
      ).toThrow();
    });
  });

  describe('WHEN using #setMetaAt() with a value that contains the metadata separator', () => {
    test('THEN an error should be thrown', () => {
      expect(() =>
        builderFactory({
          namespace,
          objectId,
          separator,
          metadataSeparator: metadataSeparator,
        }).setMetaAt(0, `abc${metadataSeparator}def`),
      ).toThrow();
    });
  });

  describe('WHEN using #setMetaAt()', () => {
    let builder: Builder;
    const index = 0;
    const value = values[0];

    beforeEach(() => {
      builder = builderFactory({
        namespace,
        objectId,
        separator,
        metadataSeparator: metadataSeparator,
      });
      builder.setMetaAt(index, value);
    });

    test('THEN the metadata array at the returned index should equal the value', () => {
      expect(builder.getMetadata()[index]).toEqual(value);
    });

    test('THEN using #getMetaAt() at the returned index should return the value', () => {
      expect(builder.getMetaAt(index)).toEqual(value);
    });

    test('THEN using #setMetaAt() again with the same index should throw an error', () => {
      expect(() => builder.setMetaAt(index, value)).toThrow();
    });
  });

  describe('WHEN using #getMetaAt() with an index out of bounds', () => {
    let builder: Builder;
    const index = 0;

    beforeEach(() => {
      builder = builderFactory({
        namespace,
        objectId,
        separator,
        metadataSeparator: metadataSeparator,
      });
    });

    test('THEN it should return null', () => {
      expect(builder.getMetaAt(index)).toBeNull();
    });
  });

  describe('WHEN instantiating with a metadatable string with .fromMetadatableString()', () => {
    let builder: Builder;
    const metaTokens = ['123', '456', '789'] as const;
    const tokens = ['abc', 'def', 'ghi'] as const;

    const metaString = metaTokens.join(metadataSeparator);
    const tokenString = tokens.join(separator);
    const string = `${namespace}${metadataSeparator}${objectId}${metadataSeparator}${metaString}${separator}${tokenString}`;

    beforeEach(() => {
      builder = (
        builderFactory({
          separator,
          namespace,
          objectId,
          metadataSeparator,
        }).constructor as typeof MetadatableCustomIdBuilder
      ).fromMetadatableString(string, separator, metadataSeparator) as Builder;
    });

    test('THEN the tokens array should equal the original tokens', () => {
      expect(builder.getTokens()).toEqual(tokens);
    });

    test('THEN the metadata array should equal the original metadata', () => {
      expect(builder.getMetadata()).toEqual(metaTokens);
    });
  });

  describe('WHEN instantiating with an empty string and empty separator with .fromMetadatableString()', () => {
    let builder: MetadatableCustomIdBuilder | null;

    beforeEach(() => {
      builder = (
        builderFactory({
          separator,
          namespace,
          objectId,
          metadataSeparator,
        }).constructor as typeof MetadatableCustomIdBuilder
      ).fromMetadatableString('', '', '');
    });

    test('THEN it should return null', () => {
      expect(builder).toBeNull();
    });
  });

  describe('WHEN instantiating with a non metadatable string with .fromMetadatableString()', () => {
    let builder: MetadatableCustomIdBuilder | null;

    beforeEach(() => {
      builder = (
        builderFactory({
          separator,
          namespace,
          objectId,
          metadataSeparator,
        }).constructor as typeof MetadatableCustomIdBuilder
      ).fromMetadatableString('abc', separator, metadataSeparator);
    });

    test('THEN it should return null', () => {
      expect(builder).toBeNull();
    });
  });

  describe('WHEN using #clone()', () => {
    let builder: Builder;
    let clone: Builder;

    beforeEach(() => {
      builder = builderFactory({
        separator,
        namespace,
        objectId,
        metadataSeparator,
      });
      builder.push(...values);
      clone = builder.clone() as Builder;
    });

    test('THEN the clone should have the same metadata', () => {
      expect(clone.getMetadata()).toEqual(builder.getMetadata());
    });
  });
}
