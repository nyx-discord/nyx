import { AbstractSubCommandGroup } from '@nyx-discord/framework';
import { SlashCommandSubcommandGroupBuilder } from 'discord.js';

export class SettingsGroup extends AbstractSubCommandGroup {
  data = new SlashCommandSubcommandGroupBuilder()
    .setName('settings')
    .setDescription('View or edit mod settings')
    .toJSON();

  constructor(parent) {
    super(parent);
  }

  execute() {}
}
