import { AbstractStandaloneCommand } from '@nyx-discord/framework';
import { SlashCommandBuilder } from 'discord.js';

export class FormatCommand extends AbstractStandaloneCommand {
  data = new SlashCommandBuilder().setName('format').setDescription('Format something').toJSON();

  execute() {}
}
