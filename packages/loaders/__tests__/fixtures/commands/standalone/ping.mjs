import { AbstractStandaloneCommand } from '@nyx-discord/framework';
import { SlashCommandBuilder } from 'discord.js';

export class PingCommand extends AbstractStandaloneCommand {
  data = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong').toJSON();

  execute() {}
}
