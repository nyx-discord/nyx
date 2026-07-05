import type { SessionRepository } from './SessionRepository';

/** Type of {@link SessionRepository} without the methods that mutate it. */
export type ReadonlySessionRepository = Omit<
  SessionRepository,
  'save' | 'delete' | 'get'
>;
