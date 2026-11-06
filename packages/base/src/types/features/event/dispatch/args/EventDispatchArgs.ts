import type { Metadata } from '#types/meta/Metadata';

/** Type of arguments used to call a {@link EventSubscriber}. */
export type EventDispatchArgs<Args extends unknown[] = unknown[]> = [
  Metadata,
  ...Args,
];
