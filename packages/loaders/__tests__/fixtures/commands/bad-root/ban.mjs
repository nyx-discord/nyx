import { AbstractSubCommand } from '@nyx-discord/framework';
import { SlashCommandSubcommandBuilder } from 'discord.js';

export class BadRootBan extends AbstractSubCommand {
  data = new SlashCommandSubcommandBuilder().setName('ban').setDescription('Ban').toJSON();

  execute() {}
}
