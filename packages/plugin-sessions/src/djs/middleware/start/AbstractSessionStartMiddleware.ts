import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { BaseSessionStartMiddleware } from '../../../shared/base/middleware/start/BaseSessionStartMiddleware.js';

export abstract class AbstractSessionStartMiddleware extends BaseSessionStartMiddleware<DjsInteractionTypes> {}
