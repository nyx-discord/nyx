import { AbstractCommandSubscriber } from '@nyx-discord/framework';

export class CommandAddSubscriber extends AbstractCommandSubscriber {
  event = 'commandAdd';

  handleEvent(meta, command) {}
}
