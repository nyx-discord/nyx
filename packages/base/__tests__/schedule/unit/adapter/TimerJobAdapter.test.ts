import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TimerJobAdapter } from '../../../../src';

const DAY = 24 * 60 * 60 * 1000;

describe('TimerJobAdapter', () => {
  let adapters: TimerJobAdapter[];

  const create = (intervalMs: number, callback = vi.fn()) => {
    const adapter = new TimerJobAdapter(intervalMs, callback);
    adapters.push(adapter);
    return { adapter, callback };
  };

  beforeEach(() => {
    vi.useFakeTimers({ now: 0 });
    adapters = [];
  });

  afterEach(() => {
    adapters.forEach((adapter) => adapter.destroy());
    vi.useRealTimers();
  });

  describe('constructor', () => {
    test.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
      'GIVEN an invalid interval (%s) THEN throws a RangeError',
      (interval) => {
        expect(() => new TimerJobAdapter(interval, vi.fn())).toThrow(
          RangeError,
        );
      },
    );

    test('GIVEN a new adapter THEN it is paused', async () => {
      const { adapter, callback } = create(1000);

      await vi.advanceTimersByTimeAsync(5000);

      expect(adapter.isRunning()).toBe(false);
      expect(adapter.getNextRun()).toBeNull();
      expect(adapter.getRaw()).toBeNull();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('resume', () => {
    test('GIVEN a sub-second interval THEN runs at exact millisecond spacing', async () => {
      const { adapter, callback } = create(1500);
      expect(adapter.resume()).toBe(adapter);

      await vi.advanceTimersByTimeAsync(1499);
      expect(callback).toHaveBeenCalledTimes(0);

      await vi.advanceTimersByTimeAsync(1);
      expect(callback).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(3000);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(adapter.getNextRun()?.getTime()).toBe(6000);
    });

    test('GIVEN an interval longer than the maximum timer delay THEN waits the full interval', async () => {
      const { adapter, callback } = create(30 * DAY);
      adapter.resume();

      await vi.advanceTimersByTimeAsync(TimerJobAdapter.MaxTimeoutMs + 1000);
      expect(callback).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(
        30 * DAY - TimerJobAdapter.MaxTimeoutMs,
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(adapter.getNextRun()?.getTime()).toBe(60 * DAY);
    });

    test('GIVEN a running adapter THEN resume does nothing', async () => {
      const { adapter, callback } = create(1000);
      adapter.resume();
      await vi.advanceTimersByTimeAsync(600);

      adapter.resume();
      await vi.advanceTimersByTimeAsync(400);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('GIVEN a slow event loop THEN missed runs are skipped without drifting', async () => {
      const { adapter, callback } = create(1000);
      adapter.resume();

      // The timeout due at 1000 fires late, at 3500, as if the event loop was blocked.
      vi.setSystemTime(2500);
      await vi.advanceTimersByTimeAsync(1000);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(adapter.getNextRun()?.getTime()).toBe(4000);
    });
  });

  describe('pause', () => {
    test('GIVEN a running adapter THEN pause stops runs', async () => {
      const { adapter, callback } = create(1000);
      adapter.resume();
      await vi.advanceTimersByTimeAsync(1000);

      expect(adapter.pause()).toBe(adapter);
      await vi.advanceTimersByTimeAsync(5000);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(adapter.isRunning()).toBe(false);
      expect(adapter.getNextRun()).toBeNull();
    });

    test('GIVEN a paused adapter THEN resume waits a full interval', async () => {
      const { adapter, callback } = create(1000);
      adapter.resume();
      await vi.advanceTimersByTimeAsync(800);
      adapter.pause();

      adapter.resume();
      await vi.advanceTimersByTimeAsync(999);
      expect(callback).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    test('GIVEN a destroyed adapter THEN it cannot be resumed', async () => {
      const { adapter, callback } = create(1000);
      adapter.resume();
      expect(adapter.destroy()).toBe(adapter);

      adapter.resume();
      await vi.advanceTimersByTimeAsync(5000);

      expect(callback).not.toHaveBeenCalled();
      expect(adapter.isRunning()).toBe(false);
    });
  });

  describe('getRaw', () => {
    test('GIVEN a running adapter THEN returns its current timeout, which changes after each run', async () => {
      const { adapter } = create(1000);
      adapter.resume();
      const first = adapter.getRaw();

      await vi.advanceTimersByTimeAsync(1000);

      expect(first).not.toBeNull();
      expect(adapter.getRaw()).not.toBeNull();
      expect(adapter.getRaw()).not.toBe(first);
    });
  });

  test('GIVEN an adapter THEN getInterval returns its interval', () => {
    expect(create(1234).adapter.getInterval()).toBe(1234);
  });
});
