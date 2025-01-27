import type { AnyEventSubscriber } from '@nyx-discord/core';
import { BasicFilterCheckMiddleware as Middleware } from '../../../filter/middleware/BasicFilterCheckMiddleware.js';

export class SubscriberFilterCheckMiddleware extends Middleware<AnyEventSubscriber> {}
