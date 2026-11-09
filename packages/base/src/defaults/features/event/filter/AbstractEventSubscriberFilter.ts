import type { EventDispatchArgs } from '#types/features/event/dispatch/args/EventDispatchArgs';
import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type { EventSubscriberFilter } from '#types/features/event/subscriber/filter/EventSubscriberFilter';
import { AbstractFilter } from '../../../filter/AbstractFilter';

/** A {@link AbstractFilter Filter} for filtering subscriber executions. */
export abstract class AbstractEventSubscriberFilter<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
  Event extends keyof ArgsRecord & string = keyof ArgsRecord & string,
>
  extends AbstractFilter<
    EventSubscriber<ArgsRecord, Event>,
    EventDispatchArgs<ArgsRecord[Event]>
  >
  implements EventSubscriberFilter<ArgsRecord, Event> {}
