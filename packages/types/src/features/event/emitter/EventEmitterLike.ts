import type { EventEmitter } from 'events';

/**
 * An object that reassembles an {@link EventEmitter}.
 *
 * Since there are many implementations of EventEmitter, and {@link EventEmitterBus} only actually
 * needs two methods from it, this type is used instead.
 */
export type EventEmitterLike = Pick<EventEmitter, 'on' | 'removeAllListeners'>;
