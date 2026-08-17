import type { Metadata } from '@nyx-discord/types';
import type { SessionEndData } from '../../end/SessionEndData.js';

/** Type of arguments used to call a {@link Session} end. */
export type SessionEndArgs = [SessionEndData<unknown>, Metadata];
