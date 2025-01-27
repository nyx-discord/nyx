import type {
  AnyEventSubscriber,
  EventDispatchArgs,
  EventSubscriberMiddleware,
} from '@nyx-discord/core';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware.js';

export abstract class AbstractEventSubscriberMiddleware
  extends AbstractMiddleware<AnyEventSubscriber, EventDispatchArgs>
  implements EventSubscriberMiddleware {}
