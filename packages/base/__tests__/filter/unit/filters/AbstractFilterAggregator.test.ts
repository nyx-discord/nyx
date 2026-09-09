import { describe, expect, test, vi } from 'vitest';
import { AndFilter } from '../../../../src';
import { StubFilter } from '../../mocks/StubFilter';

describe('AbstractFilterAggregator', () => {
  test('GIVEN push adds a filter THEN it is checked during evaluation', async () => {
    const first = StubFilter.create(true);
    const pusher = StubFilter.create(true);
    const aggregator = new AndFilter(first);
    aggregator.push(pusher);

    await aggregator.check(null);

    expect(first.check).toHaveBeenCalledOnce();
    expect(pusher.check).toHaveBeenCalledOnce();
  });

  test('GIVEN checkFilter with an object filter THEN calls filter.check', async () => {
    const filter = StubFilter.create(true);
    const aggregator = new AndFilter(filter);

    const result = await (aggregator as unknown as { checkFilter: Function }).checkFilter(filter, null);

    expect(result).toBe(true);
    expect(filter.check).toHaveBeenCalledWith(null);
  });

  test('GIVEN checkFilter with a callback THEN binds and calls it', async () => {
    const callback = vi.fn().mockResolvedValue(true);
    const aggregator = new AndFilter(StubFilter.create(true));

    const result = await (aggregator as unknown as { checkFilter: Function }).checkFilter(callback, null);

    expect(result).toBe(true);
    expect(callback).toHaveBeenCalledWith(null);
  });
});
