import { AbstractBusSubscriber } from '@nyx-discord/base';

export class BusAddSubscriber extends AbstractBusSubscriber {
  event = 'eventSubscriberAdd';

  handleEvent(meta, subscriber) {}
}
