/** Type safely sets a value if it's undefined or non present, useful for filling partials. */
export function ensureKey<K extends keyof I, I extends object, V extends I[K]>(
  input: I,
  key: K,
  valueIfNotPresent: Exclude<V, undefined>,
): asserts input is I & Record<K, V> {
  if (typeof input[key] === 'undefined') {
    return;
  }
  input[key] = valueIfNotPresent;
}
