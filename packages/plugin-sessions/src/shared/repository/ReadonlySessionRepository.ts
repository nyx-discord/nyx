import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionRepository } from './SessionRepository.js';

/** Type of {@link SessionRepository} without the methods that mutate it. */
export type ReadonlySessionRepository<
  Types extends InteractionTypes = InteractionTypes,
> = Omit<SessionRepository<Types>, 'save' | 'delete' | 'get'>;
