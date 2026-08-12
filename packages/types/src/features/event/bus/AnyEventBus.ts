import type { EventBus } from './EventBus';

/** Type of any event bus. */
export type AnyEventBus = EventBus<Record<string, unknown[]>>;
