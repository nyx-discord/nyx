import { AbstractSubCommand } from '@nyx-discord/framework';
import { SlashCommandSubcommandBuilder } from 'discord.js';

export class BadChildBan extends AbstractSubCommand {
  data = new SlashCommandSubcommandBuilder().setName('ban').setDescription('Ban a user').toJSON();

  constructor(parent) {
    super(parent);
  }

  execute() {}
}
