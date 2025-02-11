import { SlashCommandBuilder } from 'discord.js';
import { AbstractParentCommand } from '../../../src';

export class MockParentCommand extends AbstractParentCommand {
  protected createData() {
    return new SlashCommandBuilder()
      .setName('mock-parent')
      .setDescription('Mock parent command');
  }
}
