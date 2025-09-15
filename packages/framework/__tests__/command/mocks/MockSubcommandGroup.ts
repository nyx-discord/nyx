import {
  APIApplicationCommandSubcommandGroupOption,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { AbstractSubCommandGroup, ParentCommand } from '../../../src';

export class MockSubCommandGroup extends AbstractSubCommandGroup {
  protected readonly data: APIApplicationCommandSubcommandGroupOption;

  constructor(parent: ParentCommand, name?: string) {
    super(parent);
    this.data = new SlashCommandSubcommandGroupBuilder()
      .setName(name ?? 'mock-subcommand-group')
      .setDescription('Mock subcommand group')
      .toJSON();
  }

  protected createData(): SlashCommandSubcommandGroupBuilder {
    return;
  }
}
