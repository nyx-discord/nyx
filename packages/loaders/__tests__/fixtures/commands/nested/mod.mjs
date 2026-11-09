import { BaseParentCommand } from '@nyx-discord/base';

export class ModCommand extends BaseParentCommand {
  data = { name: 'mod', description: 'Moderation commands', type: 1 };
}
