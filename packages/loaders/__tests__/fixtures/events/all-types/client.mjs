import { BaseClientSubscriber } from '@nyx-discord/base';

export class ClientReadySubscriber extends BaseClientSubscriber {
  event = 'ready';

  handleEvent(meta, client) {}
}
