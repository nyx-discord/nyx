import type { Metadata } from '@nyx-discord/framework';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction';

/** Type of arguments used to call a {@link Session} update. */
export type SessionUpdateArgs = [SessionUpdateInteraction, Metadata];
