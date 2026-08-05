import { AbstractServiceSubscriber } from '@nyx-discord/framework';

export class ServiceStartSubscriber extends AbstractServiceSubscriber {
  event = 'start';

  handleEvent(meta) {}
}
