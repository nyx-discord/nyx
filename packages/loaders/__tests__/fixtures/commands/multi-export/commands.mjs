import { AbstractParentCommand, AbstractStandaloneCommand } from '@nyx-discord/framework';
import { SlashCommandBuilder } from 'discord.js';

export class MultiStandalone extends AbstractStandaloneCommand {
  data = new SlashCommandBuilder().setName('multi-standalone').setDescription('A standalone').toJSON();
  execute() {}
}

export class MultiParent extends AbstractParentCommand {
  data = new SlashCommandBuilder().setName('multi-parent').setDescription('A parent').toJSON();
  execute() {}
}
