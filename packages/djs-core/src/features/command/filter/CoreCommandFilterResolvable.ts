import type { CommandFilterResolvable } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** A {@link CommandFilterResolvable} for @discordjs/core command executions. */
export type CoreCommandFilterResolvable =
  CommandFilterResolvable<CoreInteractionTypes>;
