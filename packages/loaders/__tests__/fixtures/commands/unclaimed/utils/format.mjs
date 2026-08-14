import { BaseStandaloneCommand } from '@nyx-discord/base';

export class FormatCommand extends BaseStandaloneCommand {
  data = { name: 'format', description: 'Format something', type: 1 };

  execute() {}

  handleInteraction() {}
}
