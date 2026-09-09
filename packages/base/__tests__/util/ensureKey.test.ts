import { describe, expect, it } from 'vitest';
import { ensureKey } from '../../src';

describe('ensureKey', () => {
  it('SHOULD add the key if it does not exist', () => {
    const obj: any = {};
    ensureKey(obj, 'foo', 'bar');
    expect(obj.foo).toBe('bar');
  });

  it('SHOULD not overwrite the key if it exists', () => {
    const obj = { foo: 'baz' };
    ensureKey(obj, 'foo', 'bar');
    expect(obj.foo).toBe('baz');
  });
});
