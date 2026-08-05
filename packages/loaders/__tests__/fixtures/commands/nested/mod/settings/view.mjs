import { AbstractSubCommand } from '@nyx-discord/framework';
import { SlashCommandSubcommandBuilder } from 'discord.js';

export class ViewSettingsCommand extends AbstractSubCommand {
  data = new SlashCommandSubcommandBuilder().setName('view').setDescription('View settings').toJSON();

  constructor(parent) {
    super(parent);
  }

  execute() {}
}
