import type { EventDispatcher } from './EventDispatcher.js';

export interface AsyncEventDispatcher extends EventDispatcher {
  /** Sets the maximum amount of subscribers are called on parallel. Set to `null` to disable. */
  setConcurrencyLimit(limit: number | null): this;

  /** Gets the maximum amount of subscribers are called on parallel. */
  getConcurrencyLimit(): number | null;
}
