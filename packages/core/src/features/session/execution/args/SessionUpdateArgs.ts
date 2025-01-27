import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { SessionExecutionMeta } from '../meta/SessionExecutionMeta.js';

/** Type of arguments used to call a {@link Session} update. */
export type SessionUpdateArgs = [
  SessionUpdateInteraction,
  SessionExecutionMeta,
];
