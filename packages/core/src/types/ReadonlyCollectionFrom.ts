import type { ReadonlyCollection } from 'discord.js';

/**
 * Infer a {@link ReadonlyCollection} type from a Map (or Collection) type.
 * @example
 * ReadonlyCollectionFrom<Collection<string, string>>; // ReadonlyCollection<string, string>
 */
export type ReadonlyCollectionFrom<T extends Map<unknown, unknown>> =
  T extends Map<infer K, infer V> ? ReadonlyCollection<K, V> : never;
