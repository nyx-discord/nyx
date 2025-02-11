import { SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { AbstractSubCommandGroup } from '../../../src';

export class MockSubCommandGroup extends AbstractSubCommandGroup {
  protected createData(): SlashCommandSubcommandGroupBuilder {
    return new SlashCommandSubcommandGroupBuilder()
      .setName('mock-subcommand-group')
      .setDescription('Mock subcommand group');
  }
}
