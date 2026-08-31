import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction.js';

export type CoreSessionUpdateInteraction =
  SessionUpdateInteraction<CoreInteractionTypes>;
