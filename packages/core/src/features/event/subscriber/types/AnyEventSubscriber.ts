import type { AnyEventSubscriberFrom } from './AnyEventSubscriberFrom';

/** Type of any event subscriber. */
export type AnyEventSubscriber = AnyEventSubscriberFrom<
  Record<string, unknown[]>
>;
