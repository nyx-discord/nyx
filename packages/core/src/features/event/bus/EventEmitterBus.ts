import type { EventEmitterLike } from '../emitter/EventEmitterLike.js';
import type { EventBus } from './EventBus.js';

/** An {@link EventBus} whose events are emitted by an {@link EventEmitter}. */
export interface EventEmitterBus<
  EventArgsObject extends Record<
    keyof EventArgsObject & string,
    unknown[]
  > = Record<string, unknown[]>,
  Emitter extends EventEmitterLike = EventEmitterLike,
> extends EventBus<EventArgsObject> {
  /** Returns this bus' emitter. */
  getEmitter(): Emitter;
}
