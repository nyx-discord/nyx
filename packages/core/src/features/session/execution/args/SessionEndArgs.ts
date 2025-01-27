import type { SessionEndData } from '../../end/SessionEndData';
import type { SessionExecutionMeta } from '../meta/SessionExecutionMeta.js';

/** Type of arguments used to call a {@link Session} end. */
export type SessionEndArgs = [SessionEndData<unknown>, SessionExecutionMeta];
