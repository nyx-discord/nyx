import { AbstractParentCommand } from '@nyx-discord/framework';
import { SlashCommandBuilder } from 'discord.js';

export class BadChildModCommand extends AbstractParentCommand {
  data = new SlashCommandBuilder().setName('mod').setDescription('Moderation commands').toJSON();

  execute() {}
}
