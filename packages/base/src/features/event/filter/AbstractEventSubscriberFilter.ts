import type {
  EventDispatchArgs,
  EventSubscriber,
  EventSubscriberFilter,
} from '@nyx-discord/types';
import { AbstractFilter } from '../../../filter/AbstractFilter.js';

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
