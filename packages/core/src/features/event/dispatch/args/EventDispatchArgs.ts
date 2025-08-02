import { MetaCollection } from '../../../../meta/MetaCollection.js';

/** Type of arguments used to call a {@link EventSubscriber}. */
export type EventDispatchArgs<Args extends unknown[] = unknown[]> = [
  MetaCollection,
  ...Args,
];
