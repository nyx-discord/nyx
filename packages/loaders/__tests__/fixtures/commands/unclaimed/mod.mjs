import { BaseParentCommand } from '@nyx-discord/base';

export class UnclaimedModCommand extends BaseParentCommand {
  data = { name: 'unclaimed', description: 'Unclaimed parent', type: 1 };
}
