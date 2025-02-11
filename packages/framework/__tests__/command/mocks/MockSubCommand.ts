import { SlashCommandSubcommandBuilder } from 'discord.js';
import { AbstractSubCommand } from '../../../src';
import { MockParentCommand } from './MockParentCommand';
import { MockSubCommandGroup } from './MockSubcommandGroup';

export class MockSubCommand extends AbstractSubCommand {
  public static createOnGroup() {
    const parent = new MockParentCommand();
    const group = new MockSubCommandGroup(parent);
    return new MockSubCommand(group);
  }

  public static createOnParent() {
    const parent = new MockParentCommand();
    return new MockSubCommand(parent);
  }

  public execute = jest.fn();

  protected createData() {
    return new SlashCommandSubcommandBuilder()
      .setName('mock-subcommand')
      .setDescription('Mock subcommand');
  }
}
