import { describe, expect, test } from 'vitest';
import { FalseFilter } from '../../../../src';

describe('FalseFilter', () => {
  test('GIVEN check is called THEN returns false', () => {
    const result = FalseFilter.Instance.check();

    expect(result).toBe(false);
  });

  test('GIVEN Instance THEN is the same singleton', () => {
    expect(FalseFilter.Instance).toBe(FalseFilter.Instance);
  });

  test('GIVEN Instance THEN is an instance of FalseFilter', () => {
    expect(FalseFilter.Instance).toBeInstanceOf(FalseFilter);
  });
});
