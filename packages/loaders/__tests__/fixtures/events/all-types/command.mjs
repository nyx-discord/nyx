import { BaseCommandSubscriber } from '@nyx-discord/base';

export class CommandAddSubscriber extends BaseCommandSubscriber {
  event = 'commandAdd';

  handleEvent(meta, command) {}
}
