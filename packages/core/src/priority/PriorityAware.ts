import type { Priority } from './Priority.js';

/** An object that can be prioritized. */
export interface PriorityAware {
  getPriority(): Priority;
}
