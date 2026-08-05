import { AbstractDJSClientSubscriber } from '@nyx-discord/framework';

export class ClientReadySubscriber extends AbstractDJSClientSubscriber {
  event = 'ready';

  handleEvent(meta, client) {}
}
