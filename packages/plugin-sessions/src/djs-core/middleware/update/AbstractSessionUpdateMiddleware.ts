import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { BaseSessionUpdateMiddleware } from '../../../shared/base/middleware/update/BaseSessionUpdateMiddleware.js';

export abstract class AbstractSessionUpdateMiddleware extends BaseSessionUpdateMiddleware<CoreInteractionTypes> {}
