import type { Metadata } from '@nyx-discord/framework';
import type { SessionEndData } from '../../end/SessionEndData';

/** Type of arguments used to call a {@link Session} end. */
export type SessionEndArgs = [SessionEndData<unknown>, Metadata];
