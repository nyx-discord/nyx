import { EventEmitter } from 'events';
import { vi } from 'vitest';

export class StubEventEmitter {
  static create() {
    const emitter = new EventEmitter();
    emitter.on = vi.fn(emitter.on);
    emitter.removeAllListeners = vi.fn(emitter.removeAllListeners);
    return emitter;
  }
}
