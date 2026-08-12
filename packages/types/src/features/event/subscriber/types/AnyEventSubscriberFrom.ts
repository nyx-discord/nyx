import type { EventBusEventArgs } from '../../events/EventBusEvent';
import type { EventSubscriber } from '../EventSubscriber';

/** Type of any subscriber from an event record. */
export type AnyEventSubscriberFrom<
  ArgsRecord extends Record<string, unknown[]>,
> = EventSubscriber<
  ArgsRecord & EventBusEventArgs,
  (keyof ArgsRecord | keyof EventBusEventArgs) & string
>;
