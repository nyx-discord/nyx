import type { CommandMiddlewareResolvable } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** A {@link CommandMiddlewareResolvable} for discord.js command executions. */
export type DjsCommandMiddlewareResolvable =
  CommandMiddlewareResolvable<DjsInteractionTypes>;
