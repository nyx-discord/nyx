import { AbstractSubCommand } from '@nyx-discord/framework';
import { SlashCommandSubcommandBuilder } from 'discord.js';

export class MuteCommand extends AbstractSubCommand {
  data = new SlashCommandSubcommandBuilder().setName('mute').setDescription('Mute a user').toJSON();

  constructor(parent) {
    super(parent);
  }

  execute() {}
}
