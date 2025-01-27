import type { SessionRepository } from './SessionRepository.js';

/** Type of {@link SessionRepository} without the methods that mutate it. */
export type ReadonlySessionRepository = Omit<
  SessionRepository,
  'save' | 'delete' | 'get'
>;
