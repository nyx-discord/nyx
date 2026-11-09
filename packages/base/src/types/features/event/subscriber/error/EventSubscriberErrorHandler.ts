import type { ErrorHandler } from '#types/error/handler/ErrorHandler';
import type { AnyEventSubscriber } from '../types/AnyEventSubscriber';

export interface EventSubscriberErrorHandler<
  Subscriber extends AnyEventSubscriber = AnyEventSubscriber,
> extends ErrorHandler<Subscriber, Parameters<Subscriber['handleEvent']>> {}
