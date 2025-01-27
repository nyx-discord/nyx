import type { Collection } from '@discordjs/collection';

import type { Identifier } from '../../../../identity/Identifier.js';
import type { EventSubscriber } from '../EventSubscriber';
import type { AnyEventSubscriberFrom } from '../types/AnyEventSubscriberFrom';

/** Type of nested Collection that keys EventSubscribers by their event name, and then by their identifiers. */
export type EventSubscriberCollection<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
> = Collection<
  string,
  Collection<Identifier, AnyEventSubscriberFrom<ArgsRecord>>
> & {
  get<Event extends keyof ArgsRecord & string>(
    k: Event,
  ): Collection<Identifier, EventSubscriber<ArgsRecord, Event>>;
};
