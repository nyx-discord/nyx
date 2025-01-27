import type { SessionStartArgs } from '../execution/args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../execution/args/SessionUpdateArgs.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { SessionMiddleware } from './SessionMiddleware.js';

export interface SessionInteractionMiddleware<
  Interaction extends SessionStartInteraction | SessionUpdateInteraction,
> extends SessionMiddleware<
    Interaction extends SessionStartInteraction
      ? SessionStartArgs
      : SessionUpdateArgs
  > {}
