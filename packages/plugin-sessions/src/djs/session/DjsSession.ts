import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { Session } from '../../shared/types/session/Session.js';

export type DjsSession<Result = void> = Session<Result, DjsInteractionTypes>;
