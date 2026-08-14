import { BaseSubCommand } from '@nyx-discord/base';

export class BadChildBan extends BaseSubCommand {
  data = { name: 'ban', description: 'Ban a user', type: 1 };

  constructor(parent) {
    super(parent);
  }

  execute() {}

  handleInteraction() {}
}
