import type { Identifier } from '../../../src';
import { canBeIdentifier } from '../../../src';

const symbolIdentifier: Identifier = Symbol('Identifier');
const stringIdentifier: Identifier = 'Identifier';

describe('WHEN passing a symbol or string', () => {
  it('SHOULD return true', () => {
    expect(canBeIdentifier(symbolIdentifier)).toBe(true);
    expect(canBeIdentifier(stringIdentifier)).toBe(true);
  });
});

describe('WHEN passing any other type', () => {
  it('SHOULD return false', () => {
    expect(canBeIdentifier({})).toBe(false);
    expect(canBeIdentifier(123)).toBe(false);
    expect(canBeIdentifier(null)).toBe(false);
    expect(canBeIdentifier(undefined)).toBe(false);
    expect(canBeIdentifier(true)).toBe(false);
    expect(canBeIdentifier(false)).toBe(false);
    expect(canBeIdentifier(() => {})).toBe(false);
    expect(canBeIdentifier([])).toBe(false);
  });
});
