import type { Filter } from '../../../../filter/Filter.js';
import type { EventDispatchArgs } from '../../dispatch/args/EventDispatchArgs.js';
import type { EventSubscriber } from '../EventSubscriber.js';

/** {@link Filter} that can filter an {@link EventSubscriber}'s execution. */
export interface EventSubscriberFilter<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
  Event extends keyof ArgsRecord & string,
> extends Filter<
    EventSubscriber<ArgsRecord, Event>,
    EventDispatchArgs<ArgsRecord[Event]>
  > {}
