import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionStartInteraction } from '../../shared/types/interaction/SessionStartInteraction.js';

export type CoreSessionStartInteraction =
  SessionStartInteraction<CoreInteractionTypes>;
