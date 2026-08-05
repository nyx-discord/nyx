import { AbstractSubCommand } from '@nyx-discord/framework';
import { SlashCommandSubcommandBuilder } from 'discord.js';

export class EditSettingsCommand extends AbstractSubCommand {
  data = new SlashCommandSubcommandBuilder().setName('edit').setDescription('Edit settings').toJSON();

  constructor(parent) {
    super(parent);
  }

  execute() {}
}
