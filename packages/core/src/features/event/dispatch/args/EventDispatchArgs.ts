import type { EventDispatchMeta } from '../meta/EventDispatchMeta.js';

/** Type of arguments used to call a {@link EventSubscriber}. */
export type EventDispatchArgs<Args extends unknown[] = unknown[]> = [
  EventDispatchMeta,
  ...Args,
];
