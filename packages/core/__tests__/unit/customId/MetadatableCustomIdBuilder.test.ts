import { MetadatableCustomIdBuilder } from '../../../src';
import { runBaseTests } from './helpers/BaseCustomIdBuilderTests.test';
import { runMetadatableTests } from './helpers/MetadatableTests.test';

const namespace = 'TEST';
const objectId = 'myObject';
const separator = '-';
const metadataSeparator = '|';

runBaseTests((options) => {
  // Charcode magic to make sure the metadata separator is not the same as the separator
  const testDataSeparator = String.fromCharCode(
    options.separator.charCodeAt(0) + 1,
  );

  return new MetadatableCustomIdBuilder({
    ...options,
    namespace,
    objectId,
    metadataSeparator: testDataSeparator,
  });
});

runMetadatableTests((options) => {
  return new MetadatableCustomIdBuilder(options);
});

describe('WHEN using #push() and #pushMeta() with multiple values', () => {
  const metaTokens = ['123', '456', '789'] as const;
  const tokens = ['abc', 'def', 'ghi'] as const;

  const metaString = metaTokens.join(metadataSeparator);
  const tokenString = tokens.join(separator);
  const expectedString = `${namespace}${metadataSeparator}${objectId}${metadataSeparator}${metaString}${separator}${tokenString}`;

  let builder: MetadatableCustomIdBuilder;

  beforeEach(() => {
    builder = new MetadatableCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });
    builder.pushMeta(...metaTokens);
    builder.push(...tokens);
  });

  test('THEN using #build() should return the expected string', () => {
    expect(builder.build()).toEqual(expectedString);
  });
});
