import { describe, expect, test } from 'vitest';
import { TrueFilter } from '../../../../src';

describe('TrueFilter', () => {
  test('GIVEN check is called THEN returns true', () => {
    const result = TrueFilter.Instance.check();

    expect(result).toBe(true);
  });

  test('GIVEN Instance THEN is the same singleton', () => {
    expect(TrueFilter.Instance).toBe(TrueFilter.Instance);
  });

  test('GIVEN Instance THEN is an instance of TrueFilter', () => {
    expect(TrueFilter.Instance).toBeInstanceOf(TrueFilter);
  });
});
