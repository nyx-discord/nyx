/** A type that turns every element in an array as optional. */
export type OptionalArray<T> = T extends [...infer U, unknown]
  ? T | OptionalArray<U>
  : [];
