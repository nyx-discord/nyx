import { BaseParentCommand, BaseStandaloneCommand } from '@nyx-discord/base';

export class MultiStandalone extends BaseStandaloneCommand {
  data = { name: 'multi-standalone', description: 'A standalone', type: 1 };

  execute() {}

  handleInteraction() {}
}

export class MultiParent extends BaseParentCommand {
  data = { name: 'multi-parent', description: 'A parent', type: 1 };
}
