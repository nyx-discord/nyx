import { BaseContextMenuCommand } from '@nyx-discord/base';

export class ReportUserCommand extends BaseContextMenuCommand {
  data = { name: 'Report User', type: 2 };

  execute() {}

  handleInteraction() {}
}
