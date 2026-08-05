import { AbstractBusSubscriber } from '@nyx-discord/framework';

export class BusAddSubscriber extends AbstractBusSubscriber {
  event = 'eventSubscriberAdd';

  handleEvent(meta, subscriber) {}
}
