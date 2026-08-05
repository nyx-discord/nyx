import { AbstractParentCommand } from '@nyx-discord/framework';
import { SlashCommandBuilder } from 'discord.js';

export class UnclaimedModCommand extends AbstractParentCommand {
  data = new SlashCommandBuilder().setName('unclaimed').setDescription('Unclaimed parent').toJSON();

  execute() {}
}
