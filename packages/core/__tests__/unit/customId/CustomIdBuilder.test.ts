import { CustomIdBuilder } from '../../../src';
import { runBaseTests } from './helpers/BaseCustomIdBuilderTests.test';

runBaseTests((options) => new CustomIdBuilder(options));

const separator = '-';

describe('WHEN using #push() with multiple values', () => {
  let builder: CustomIdBuilder;
  const values = ['abc', 'def', 'ghi'];

  beforeEach(() => {
    builder = new CustomIdBuilder({ separator });
    builder.push(...values);
  });

  test('THEN using #build() should return the values joined by the separator', () => {
    expect(builder.build()).toEqual(values.join(separator));
  });

  test('THEN using #toString() should return the values joined by the separator', () => {
    expect(builder.toString()).toEqual(values.join(separator));
  });

  test('THEN when using #build(), if the result is longer than the length limit, an error should be thrown', () => {
    builder.push('1'.repeat(CustomIdBuilder.LengthLimit));

    expect(() => builder.build()).toThrow();
  });

  test('THEN when using #toString(), if the result is longer than the length limit, an error should be thrown', () => {
    builder.push('1'.repeat(CustomIdBuilder.LengthLimit));

    expect(() => builder.toString()).toThrow();
  });
});
