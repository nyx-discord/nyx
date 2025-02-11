import type { SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { AbstractStandaloneCommand } from '../../../src';

export class MockStandaloneCommand extends AbstractStandaloneCommand {
  protected readonly name?: string;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  protected createData(): SlashCommandOptionsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName(this.name ?? 'mock-standalone')
      .setDescription('Mock command');
  }

  public execute = jest.fn();
}
