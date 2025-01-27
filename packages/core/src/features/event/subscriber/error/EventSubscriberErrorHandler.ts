import type { ErrorHandler } from '../../../../error/handler/ErrorHandler.js';
import type { AnyEventSubscriber } from '../types/AnyEventSubscriber';

export interface EventSubscriberErrorHandler<
  Subscriber extends AnyEventSubscriber = AnyEventSubscriber,
> extends ErrorHandler<Subscriber, Parameters<Subscriber['handleEvent']>> {}
