import { BaseSubCommand } from '@nyx-discord/base';

export class BadRootBan extends BaseSubCommand {
  data = { name: 'ban', description: 'Ban', type: 1 };

  constructor(parent) {
    super(parent);
  }

  execute() {}

  handleInteraction() {}
}
