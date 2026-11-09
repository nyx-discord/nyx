import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { Session } from '../../shared/types/session/Session.js';

export type CoreSession<Result = void> = Session<Result, CoreInteractionTypes>;
