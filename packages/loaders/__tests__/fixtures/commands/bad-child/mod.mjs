import { BaseParentCommand } from '@nyx-discord/base';

export class BadChildModCommand extends BaseParentCommand {
  data = { name: 'mod', description: 'Moderation commands', type: 1 };
}
