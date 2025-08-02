import { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';

/** Type of arguments used to call a {@link Session} update. */
export type SessionUpdateArgs = [SessionUpdateInteraction, MetaCollection];
