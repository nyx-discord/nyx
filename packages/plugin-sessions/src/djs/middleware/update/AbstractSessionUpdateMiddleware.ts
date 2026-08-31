import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { BaseSessionUpdateMiddleware } from '../../../shared/base/middleware/update/BaseSessionUpdateMiddleware.js';

export abstract class AbstractSessionUpdateMiddleware extends BaseSessionUpdateMiddleware<DjsInteractionTypes> {}
