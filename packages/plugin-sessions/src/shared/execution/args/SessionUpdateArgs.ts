import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';

/** Type of arguments used to call a {@link Session} update. */
export type SessionUpdateArgs<
  Types extends InteractionTypes = InteractionTypes,
> = [SessionUpdateInteraction<Types>, Metadata];
