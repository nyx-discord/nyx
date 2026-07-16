import { describe, expect, test, vi } from 'vitest';
import { NotFilter } from '../../../../src';
import { StubFilter } from '../../mocks/StubFilter';

describe('NotFilter', () => {
  test('GIVEN inner filter passes THEN returns false', async () => {
    const inner = StubFilter.create(true);
    const not = new NotFilter(inner);

    const result = await not.check(null);

    expect(result).toBe(false);
    expect(inner.check).toHaveBeenCalledOnce();
  });

  test('GIVEN inner filter fails THEN returns true', async () => {
    const inner = StubFilter.create(false);
    const not = new NotFilter(inner);

    const result = await not.check(null);

    expect(result).toBe(true);
  });

  test('GIVEN a callback filter THEN inverts its result', async () => {
    const fn = vi.fn().mockResolvedValue(true);
    const not = new NotFilter(fn);

    const result = await not.check(null);

    expect(result).toBe(false);
    expect(fn).toHaveBeenCalledOnce();
  });

  test('GIVEN a callback filter that fails THEN returns true', async () => {
    const fn = vi.fn().mockResolvedValue(false);
    const not = new NotFilter(fn);

    const result = await not.check(null);

    expect(result).toBe(true);
  });
});
