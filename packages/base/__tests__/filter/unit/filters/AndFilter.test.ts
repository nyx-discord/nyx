import { describe, expect, test, vi } from 'vitest';
import { AndFilter } from '../../../../src';
import { StubFilter } from '../../mocks/StubFilter';

describe('AndFilter', () => {
  test('GIVEN all filters pass THEN returns true', async () => {
    const filter1 = StubFilter.create(true);
    const filter2 = StubFilter.create(true);
    const and = new AndFilter(filter1, filter2);

    const result = await and.check(null);

    expect(result).toBe(true);
    expect(filter1.check).toHaveBeenCalledOnce();
    expect(filter2.check).toHaveBeenCalledOnce();
  });

  test('GIVEN a filter fails THEN returns false and stops', async () => {
    const filter1 = StubFilter.create(true);
    const filter2 = StubFilter.create(false);
    const filter3 = StubFilter.create(true);
    const and = new AndFilter(filter1, filter2, filter3);

    const result = await and.check(null);

    expect(result).toBe(false);
    expect(filter1.check).toHaveBeenCalledOnce();
    expect(filter2.check).toHaveBeenCalledOnce();
    expect(filter3.check).not.toHaveBeenCalled();
  });

  test('GIVEN a single filter passing THEN returns true', async () => {
    const filter = StubFilter.create(true);
    const and = new AndFilter(filter);

    const result = await and.check(null);

    expect(result).toBe(true);
  });

  test('GIVEN callback filters THEN evaluates them', async () => {
    const passFn = vi.fn().mockResolvedValue(true);
    const failFn = vi.fn().mockResolvedValue(false);
    const and = new AndFilter(passFn, failFn);

    const result = await and.check(null);

    expect(result).toBe(false);
    expect(passFn).toHaveBeenCalledOnce();
    expect(failFn).toHaveBeenCalledOnce();
  });
});
