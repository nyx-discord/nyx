import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { BaseSessionStartMiddleware } from '../../../shared/base/middleware/start/BaseSessionStartMiddleware.js';

export abstract class AbstractSessionStartMiddleware extends BaseSessionStartMiddleware<CoreInteractionTypes> {}
