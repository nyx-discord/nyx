import { AbstractContextMenuCommand } from '@nyx-discord/framework';
import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

export class ReportUserCommand extends AbstractContextMenuCommand {
  data = new ContextMenuCommandBuilder()
    .setName('Report User')
    .setType(ApplicationCommandType.User)
    .toJSON();

  execute() {}
}
