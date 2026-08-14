import { BaseSubCommand } from '@nyx-discord/base';

export class MuteCommand extends BaseSubCommand {
  data = { name: 'mute', description: 'Mute a user', type: 1 };

  constructor(parent) {
    super(parent);
  }

  execute() {}

  handleInteraction() {}
}
