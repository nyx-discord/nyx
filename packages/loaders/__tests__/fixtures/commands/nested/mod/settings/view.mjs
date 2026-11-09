import { BaseSubCommand } from '@nyx-discord/base';

export class ViewSettingsCommand extends BaseSubCommand {
  data = { name: 'view', description: 'View settings', type: 1 };

  constructor(parent) {
    super(parent);
  }

  execute() {}

  handleInteraction() {}
}
