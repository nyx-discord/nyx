/**
 * An object that resembles an `EventEmitter`.
 *
 * Since there are many implementations of EventEmitter, and {@link EventEmitterBus} only actually
 * needs two methods from it, this type is used instead.
 */
export interface EventEmitterLike {
  on(event: string | symbol, listener: (...args: any[]) => void): unknown;

  removeAllListeners(event?: string | symbol): unknown;
}
