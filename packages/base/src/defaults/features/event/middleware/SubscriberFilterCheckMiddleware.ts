import type { AnyEventSubscriber } from '#types/features/event/subscriber/types/AnyEventSubscriber';
import { BasicFilterCheckMiddleware as Middleware } from '../../../filter/middleware/BasicFilterCheckMiddleware';

export class SubscriberFilterCheckMiddleware extends Middleware<AnyEventSubscriber> {}
