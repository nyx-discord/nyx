import type { AwaitableEventEmitter } from './AwaitableEventEmitter.js';

type Listener = (...args: any[]) => unknown;

export class BasicAwaitableEventEmitter<
  Events extends Record<keyof Events, unknown[]>,
> implements AwaitableEventEmitter<Events> {
  protected readonly listeners = new Map<string, Listener[]>();

  public on<Event extends keyof Events & string>(
    event: Event,
    listener: (...args: Events[Event]) => unknown,
  ): this {
    const listeners = this.listeners.get(event) ?? [];
    listeners.push(listener as Listener);
    this.listeners.set(event, listeners);
    return this;
  }

  public off<Event extends keyof Events & string>(
    event: Event,
    listener: (...args: Events[Event]) => unknown,
  ): this {
    const listeners = this.listeners.get(event);
    if (!listeners) return this;

    const index = listeners.indexOf(listener as Listener);
    if (index !== -1) listeners.splice(index, 1);
    if (!listeners.length) this.listeners.delete(event);
    return this;
  }

  public removeAllListeners(event?: keyof Events & string): this {
    if (event === undefined) {
      this.listeners.clear();
    } else {
      this.listeners.delete(event);
    }
    return this;
  }

  // not async, so listeners run synchronously and a listener that throws throws from emit(), like Node's EventEmitter
  public emit<Event extends keyof Events & string>(
    event: Event,
    ...args: Events[Event]
  ): Promise<void> {
    const listeners = [...(this.listeners.get(event) ?? [])];
    const results = listeners.map((listener) => listener(...args));
    return Promise.allSettled(results).then(() => undefined);
  }
}
