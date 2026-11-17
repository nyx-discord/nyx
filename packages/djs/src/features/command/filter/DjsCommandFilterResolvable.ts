import type { CommandFilterResolvable } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** A {@link CommandFilterResolvable} for discord.js command executions. */
export type DjsCommandFilterResolvable =
  CommandFilterResolvable<DjsInteractionTypes>;
