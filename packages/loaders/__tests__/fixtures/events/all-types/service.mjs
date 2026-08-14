import { AbstractServiceSubscriber } from '@nyx-discord/base';

export class ServiceStartSubscriber extends AbstractServiceSubscriber {
  event = 'start';

  handleEvent(meta) {}
}
