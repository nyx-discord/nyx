import { describe, expect, test, vi } from 'vitest';
import { BasicAwaitableEventEmitter } from '../../../src';

type TestEvents = {
  test: [value: string];
  other: [value: number];
};

describe('BasicAwaitableEventEmitter', () => {
  test('GIVEN listeners WHEN emitting THEN calls them synchronously, in order, with the arguments', () => {
    const emitter = new BasicAwaitableEventEmitter<TestEvents>();
    const calls: string[] = [];
    emitter.on('test', (value) => calls.push(`first ${value}`));
    emitter.on('test', (value) => calls.push(`second ${value}`));

    void emitter.emit('test', 'a');

    expect(calls).toEqual(['first a', 'second a']);
  });

  test('GIVEN async listeners WHEN emitting THEN resolves only after all of them settle', async () => {
    const emitter = new BasicAwaitableEventEmitter<TestEvents>();
    let finish!: () => void;
    emitter.on(
      'test',
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    emitter.on('test', () => Promise.resolve());

    let settled = false;
    const emitting = emitter.emit('test', 'a').then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    finish();
    await emitting;
    expect(settled).toBe(true);
  });

  test('GIVEN a listener that rejects WHEN emitting THEN still resolves', async () => {
    const emitter = new BasicAwaitableEventEmitter<TestEvents>();
    emitter.on('test', () => Promise.reject(new Error('handled elsewhere')));

    await expect(emitter.emit('test', 'a')).resolves.toBeUndefined();
  });

  test('GIVEN a listener that throws synchronously WHEN emitting THEN emit throws', () => {
    const emitter = new BasicAwaitableEventEmitter<TestEvents>();
    emitter.on('test', () => {
      throw new Error('sync');
    });

    expect(() => emitter.emit('test', 'a')).toThrow('sync');
  });

  test('GIVEN no listeners WHEN emitting THEN resolves', async () => {
    const emitter = new BasicAwaitableEventEmitter<TestEvents>();

    await expect(emitter.emit('test', 'a')).resolves.toBeUndefined();
  });

  test('GIVEN removed listeners WHEN emitting THEN they are not called', async () => {
    const emitter = new BasicAwaitableEventEmitter<TestEvents>();
    const removed = vi.fn();
    const kept = vi.fn();
    const other = vi.fn();
    emitter.on('test', removed).on('test', kept).on('other', other);

    emitter.off('test', removed);
    await emitter.emit('test', 'a');
    emitter.removeAllListeners('test');
    await emitter.emit('test', 'b');
    emitter.removeAllListeners();
    await emitter.emit('other', 1);

    expect(removed).not.toHaveBeenCalled();
    expect(kept).toHaveBeenCalledTimes(1);
    expect(other).not.toHaveBeenCalled();
  });
});
