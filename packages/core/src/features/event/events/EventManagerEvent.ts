import type { AnyEventBus } from '../bus/AnyEventBus';

/** Enum of possible event manager events. */
export const EventManagerEventEnum = {
  /** Emitted when an event bus is added. */
  EventBusAdd: 'eventBusAdd',
  /** Emitted when an event bus is removed. */
  EventBusRemove: 'eventBusRemove',
} as const satisfies Record<string, keyof EventManagerEventsArgs>;

/** Type of values of {@link EventManagerEventEnum}. */
export type EventManagerEvent =
  (typeof EventManagerEventEnum)[keyof typeof EventManagerEventEnum];

/** Record of arguments for each event manager event. */
export interface EventManagerEventsArgs {
  eventBusAdd: [bus: AnyEventBus];
  eventBusRemove: [bus: AnyEventBus];
}
