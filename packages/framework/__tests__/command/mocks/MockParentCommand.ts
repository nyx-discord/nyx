import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from 'discord.js';
import { AbstractParentCommand } from '../../../src';

export class MockParentCommand extends AbstractParentCommand {
  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;

  constructor(name?: string) {
    super();
    this.data = new SlashCommandBuilder()
      .setName(name ?? 'mock-parent')
      .setDescription('Mock command')
      .toJSON();
  }
}
