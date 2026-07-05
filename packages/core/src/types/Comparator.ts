/** Type of a function that compares two values and returns a number indicating their relative order. */
export type Comparator<Key, Value> = (
  firstValue: Value,
  secondValue: Value,
  firstKey: Key,
  secondKey: Key,
) => number;
