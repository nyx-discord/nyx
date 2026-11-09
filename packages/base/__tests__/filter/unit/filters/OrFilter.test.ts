import { describe, expect, test, vi } from 'vitest';
import { OrFilter } from '../../../../src';
import { StubFilter } from '../../mocks/StubFilter';

describe('OrFilter', () => {
  test('GIVEN any filter passes THEN returns true and stops', async () => {
    const filter1 = StubFilter.create(false);
    const filter2 = StubFilter.create(true);
    const filter3 = StubFilter.create(true);
    const or = new OrFilter(filter1, filter2, filter3);

    const result = await or.check(null);

    expect(result).toBe(true);
    expect(filter1.check).toHaveBeenCalledOnce();
    expect(filter2.check).toHaveBeenCalledOnce();
    expect(filter3.check).not.toHaveBeenCalled();
  });

  test('GIVEN all filters fail THEN returns false', async () => {
    const filter1 = StubFilter.create(false);
    const filter2 = StubFilter.create(false);
    const or = new OrFilter(filter1, filter2);

    const result = await or.check(null);

    expect(result).toBe(false);
    expect(filter1.check).toHaveBeenCalledOnce();
    expect(filter2.check).toHaveBeenCalledOnce();
  });

  test('GIVEN first filter passes THEN returns true immediately', async () => {
    const filter1 = StubFilter.create(true);
    const filter2 = StubFilter.create(false);
    const or = new OrFilter(filter1, filter2);

    const result = await or.check(null);

    expect(result).toBe(true);
    expect(filter1.check).toHaveBeenCalledOnce();
    expect(filter2.check).not.toHaveBeenCalled();
  });

  test('GIVEN callback filters THEN evaluates them', async () => {
    const passFn = vi.fn().mockResolvedValue(true);
    const failFn = vi.fn().mockResolvedValue(false);
    const or = new OrFilter(failFn, passFn);

    const result = await or.check(null);

    expect(result).toBe(true);
    expect(failFn).toHaveBeenCalledOnce();
    expect(passFn).toHaveBeenCalledOnce();
  });
});
