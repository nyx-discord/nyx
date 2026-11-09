import { BaseStandaloneCommand } from '@nyx-discord/base';

export class BadChildStandalone extends BaseStandaloneCommand {
  data = { name: 'standalone', description: 'Should not be here', type: 1 };

  execute() {}

  handleInteraction() {}
}
