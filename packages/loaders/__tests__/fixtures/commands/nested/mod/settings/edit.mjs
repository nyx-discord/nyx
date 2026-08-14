import { BaseSubCommand } from '@nyx-discord/base';

export class EditSettingsCommand extends BaseSubCommand {
  data = { name: 'edit', description: 'Edit settings', type: 1 };

  constructor(parent) {
    super(parent);
  }

  execute() {}

  handleInteraction() {}
}
