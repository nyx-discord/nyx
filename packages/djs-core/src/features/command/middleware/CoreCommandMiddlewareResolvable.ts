import type { CommandMiddlewareResolvable } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** A {@link CommandMiddlewareResolvable} for @discordjs/core command executions. */
export type CoreCommandMiddlewareResolvable =
  CommandMiddlewareResolvable<CoreInteractionTypes>;
