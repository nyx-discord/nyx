/**
 * An object's priority compared to others in the same place.
 *
 * The specific sorting depends on the implementation, but
 * in general priority Highest to Lowest is advised.
 *
 * `Monitor` is a special priority type, meant to be used for overseeing
 * purposes, like statistics.
 *
 * For example in a Middleware context, you can use `HighMonitor` to see how
 * many requests come in, and `LowMonitor` to see how many got through all the
 * middlewares and will actually be executed.
 */
export const PriorityEnum = {
  LowMonitor: 0,
  Lowest: 1,
  Low: 2,
  Normal: 3,
  High: 4,
  Highest: 5,
  HighMonitor: 6,
} as const;

/** Type of values of {@link PriorityEnum}. */
export type Priority = (typeof PriorityEnum)[keyof typeof PriorityEnum];
