import type { FilterResolvableFrom } from '../../../../filter/FilterResolvable';
import type { EventSubscriberFilter } from './EventSubscriberFilter';

export type EventSubscriberFilterResolvable<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
  Event extends keyof ArgsRecord & string,
> = FilterResolvableFrom<EventSubscriberFilter<ArgsRecord, Event>>;
