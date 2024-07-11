import { StringIterator } from '../../../src';

const tokens = ['a', 'b', 'c'];
const separator = '-';
const string = tokens.join(separator);

describe('WHEN instantiated', () => {
  const iterator = new StringIterator(tokens);

  test('THEN the tokens should be set', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });

  test('THEN the size should be set', () => {
    expect(iterator.size).toEqual(tokens.length);
  });

  test('THEN the position should begin at 0', () => {
    expect(iterator.getPosition()).toEqual(0);
  });
});

describe('WHEN instantiated with .fromString()', () => {
  const iterator = StringIterator.fromString(string, separator);

  test('THEN the tokens should be the string split by the separator', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });
});

describe('WHEN instantiated with .fromStringAt()', () => {
  const position = 1;
  const iterator = StringIterator.fromStringAt(string, separator, position);

  test('THEN the tokens should be the string split by the separator', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });

  test('THEN the position should be set to the one passed', () => {
    expect(iterator.getPosition()).toEqual(position);
  });
});

describe('WHEN using #get()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN using it again should return the next token', () => {
    expect(iterator.get()).toEqual(tokens[0]);
    expect(iterator.get()).toEqual(tokens[1]);
    expect(iterator.get()).toEqual(tokens[2]);
  });

  test('THEN using it out of bounds should return null if not forced', () => {
    tokens.map(() => iterator.get());
    expect(iterator.get(false)).toEqual(null);
  });

  test('THEN using it out of bounds should throw if forced', () => {
    tokens.map(() => iterator.get());
    expect(() => iterator.get(true)).toThrow();
  });
});

describe('WHEN using #peek()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN using it again should return the same token', () => {
    expect(iterator.peek()).toEqual(tokens[0]);
    expect(iterator.peek()).toEqual(tokens[0]);
  });

  test('THEN using it again should not change the position', () => {
    iterator.peek();
    expect(iterator.getPosition()).toEqual(0);
  });

  test('THEN using it out of bounds should return null if not forced', () => {
    tokens.map(() => iterator.get());
    expect(iterator.peek(false)).toEqual(null);
  });

  test('THEN using it out of bounds should throw if forced', () => {
    tokens.map(() => iterator.get());
    expect(() => iterator.peek(true)).toThrow();
  });
});

describe('WHEN using #next()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return the next token', () => {
    expect(iterator.next()).toEqual(tokens[1]);
    expect(iterator.next()).toEqual(tokens[2]);
  });

  test('THEN it should increment the position', () => {
    iterator.next();
    expect(iterator.getPosition()).toEqual(1);
  });

  test('THEN using it out of bounds should return null if not forced', () => {
    tokens.map(() => iterator.get());
    expect(iterator.next(false)).toEqual(null);
  });

  test('THEN using it out of bounds should throw if forced', () => {
    tokens.map(() => iterator.get());
    expect(() => iterator.next(true)).toThrow();
  });
});

describe('WHEN using #previous()', () => {
  let iterator: StringIterator;
  const finalIndex = tokens.length - 1;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
    iterator.setAt(finalIndex);
  });

  test('THEN it should return the previous token', () => {
    expect(iterator.previous()).toEqual(tokens[finalIndex - 1]);
    expect(iterator.previous()).toEqual(tokens[finalIndex - 2]);
  });

  test('THEN it should decrement the position', () => {
    iterator.previous();
    expect(iterator.getPosition()).toEqual(finalIndex - 1);
  });

  test('THEN using it out of bounds should return null if not forced', () => {
    iterator.setAt(0);
    expect(iterator.previous(false)).toEqual(null);
  });

  test('THEN using it out of bounds should throw if forced', () => {
    iterator.setAt(0);
    expect(() => iterator.previous(true)).toThrow();
  });
});

describe('WHEN using #getNextPosition()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return the next position', () => {
    expect(iterator.getNextPosition()).toEqual(1);
  });
});

describe('WHEN using #getPreviousPosition()', () => {
  let iterator: StringIterator;
  const finalIndex = tokens.length - 1;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
    iterator.setAt(finalIndex);
  });

  test('THEN it should return the previous position', () => {
    expect(iterator.getPreviousPosition()).toEqual(finalIndex - 1);
  });
});

describe('WHEN using #hasPrevious()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return true if there is a previous token', () => {
    iterator.setAt(1);
    expect(iterator.hasPrevious()).toEqual(true);
  });

  test('THEN it should return false if there is no previous token', () => {
    iterator.setAt(0);
    expect(iterator.hasPrevious()).toEqual(false);
  });
});

describe('WHEN using #hasNext()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return true if there is a next token', () => {
    iterator.setAt(0);
    expect(iterator.hasNext()).toEqual(true);
  });

  test('THEN it should return false if there is no next token', () => {
    iterator.setAt(tokens.length);
    expect(iterator.hasNext()).toEqual(false);
  });
});

describe('WHEN using #getAt()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return the token at the specified index', () => {
    expect(iterator.getAt(0)).toEqual(tokens[0]);
    expect(iterator.getAt(1)).toEqual(tokens[1]);
    expect(iterator.getAt(2)).toEqual(tokens[2]);
  });

  test('THEN using it out of bounds should return null if not forced', () => {
    expect(iterator.getAt(tokens.length, false)).toEqual(null);
  });

  test('THEN using it out of bounds should throw if forced', () => {
    expect(() => iterator.getAt(tokens.length, true)).toThrow();
  });

  test('THEN passing negative index should have the same behavior as Array#at()', () => {
    expect(iterator.getAt(-1)).toEqual(tokens[tokens.length - 1]);
    expect(iterator.getAt(-2)).toEqual(tokens[tokens.length - 2]);
    expect(iterator.getAt(-3)).toEqual(tokens[tokens.length - 3]);
  });
});

describe('WHEN using #map()', () => {
  let iterator: StringIterator;
  let mapped: string[];

  beforeEach(() => {
    iterator = new StringIterator(tokens);
    mapped = iterator.map((token) => token.toUpperCase());
  });

  test('THEN it should return an array with the mapped tokens', () => {
    expect(mapped).toEqual(tokens.map((token) => token.toUpperCase()));
  });

  test('THEN it should not affect the original iterator', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });
});

describe('WHEN using #mapToIterator()', () => {
  let iterator: StringIterator;
  let mapped: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
    mapped = iterator.mapToIterator((token) => token.toUpperCase());
  });

  test('THEN it should return an iterator with the mapped tokens', () => {
    expect(mapped.getTokens()).toEqual(
      tokens.map((token) => token.toUpperCase()),
    );
  });

  test('THEN it should not affect the original iterator', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });
});

describe('WHEN using #filter()', () => {
  let iterator: StringIterator;
  let filtered: string[];

  beforeEach(() => {
    iterator = new StringIterator(tokens);
    filtered = iterator.filter((token) => token !== 'b');
  });

  test('THEN it should return an array with the filtered tokens', () => {
    expect(filtered).toEqual(tokens.filter((token) => token !== 'b'));
  });

  test('THEN it should not affect the original iterator', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });
});

describe('WHEN using #filterToIterator()', () => {
  let iterator: StringIterator;
  let filtered: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
    filtered = iterator.filterToIterator((token) => token !== 'b');
  });

  test('THEN it should return an iterator with the filtered tokens', () => {
    expect(filtered.getTokens()).toEqual(
      tokens.filter((token) => token !== 'b'),
    );
  });

  test('THEN it should not affect the original iterator', () => {
    expect(iterator.getTokens()).toEqual(tokens);
  });
});

describe('WHEN using #clone()', () => {
  let iterator: StringIterator;
  let cloned: StringIterator;
  const index = 1;

  beforeEach(() => {
    iterator = new StringIterator(tokens).setAt(index);
    cloned = iterator.clone();
  });

  test('THEN it should return a new iterator with the same tokens', () => {
    expect(cloned.getTokens()).toEqual(tokens);
  });

  test('THEN it should return a new iterator with the same position', () => {
    expect(cloned.getPosition()).toEqual(index);
  });

  test('THEN changes to the clone should not affect the original', () => {
    cloned.setAt(0);
    expect(iterator.getPosition()).toEqual(index);
  });
});

describe('WHEN using #toString()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return the string representation of the tokens', () => {
    expect(iterator.toString()).toEqual(tokens.join());
  });
});

describe('WHEN using #join()', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should return the string representation of the tokens, joined by the passed separator', () => {
    expect(iterator.join(';')).toEqual(tokens.join(';'));
  });
});

describe('WHEN using it as an IterableIterator', () => {
  let iterator: StringIterator;

  beforeEach(() => {
    iterator = new StringIterator(tokens);
  });

  test('THEN it should be iterable by its tokens', () => {
    expect([...iterator]).toEqual(tokens);
  });
});
