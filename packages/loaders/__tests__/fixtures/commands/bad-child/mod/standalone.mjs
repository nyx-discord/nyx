import { AbstractStandaloneCommand } from '@nyx-discord/framework';
import { SlashCommandBuilder } from 'discord.js';

export class BadChildStandalone extends AbstractStandaloneCommand {
  data = new SlashCommandBuilder().setName('standalone').setDescription('Should not be here').toJSON();

  execute() {}
}
