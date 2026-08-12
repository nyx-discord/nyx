/**
 * Specify how long a subscriber will last inside an event bus, same as Node's
 * `EventEmitter#on()` and `EventEmitter#once()`.
 *
 * Can be:
 * * {@link EventSubscriberLifetimeEnum#Once} - Unregistered automatically
 * after its first execution.
 * * {@link EventSubscriberLifetimeEnum#On} - Constant listener, exists until
 * unregistered.
 */
export const EventSubscriberLifetimeEnum = {
  Once: 'Once',
  On: 'On',
} as const;

/** Type of values of {@link EventSubscriberLifetimeEnum}. */
export type EventSubscriberLifetime =
  (typeof EventSubscriberLifetimeEnum)[keyof typeof EventSubscriberLifetimeEnum];
