import type { AnyEventSubscriber } from '../subscriber/types/AnyEventSubscriber';

/** Enum of possible event bus events. */
export const EventBusEventEnum = {
  EventSubscriberAdd: 'eventSubscriberAdd',
  EventSubscriberRemove: 'eventSubscriberRemove',
} as const satisfies Record<string, keyof EventBusEventArgs>;

/** Type of values of {@link EventBusEventEnum}. */
export type EventBusEvent =
  (typeof EventBusEventEnum)[keyof typeof EventBusEventEnum];

/** Record of arguments for each event bus event. */
export interface EventBusEventArgs {
  eventSubscriberAdd: [subscriber: AnyEventSubscriber];
  eventSubscriberRemove: [subscriber: AnyEventSubscriber];
}
