import { BaseSubCommandGroup } from '@nyx-discord/base';

export class SettingsGroup extends BaseSubCommandGroup {
  data = { name: 'settings', description: 'View or edit mod settings', type: 2 };

  constructor(parent) {
    super(parent);
  }
}
