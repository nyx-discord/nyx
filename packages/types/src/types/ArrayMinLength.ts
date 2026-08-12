// https://tenor.com/view/sad-seal-programming-compsci-computer-science-gif-21430889
type BuildArrayMinLength<
  T,
  N extends number,
  Current extends T[],
> = Current['length'] extends N
  ? [...Current, ...T[]]
  : BuildArrayMinLength<T, N, [...Current, T]>;

/** Type of array of a given minimum length. */
export type ArrayMinLength<Of, MinLength extends number> = BuildArrayMinLength<
  Of,
  MinLength,
  []
>;
