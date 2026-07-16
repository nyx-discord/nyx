import {
  APIApplicationCommandSubcommandOption,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { vi } from 'vitest';
import {
  AbstractSubCommand,
  ParentCommand,
  SubCommandGroup,
} from '../../../src';
import { MockParentCommand } from './MockParentCommand';
import { MockSubCommandGroup } from './MockSubCommandGroup';

export class MockSubCommand extends AbstractSubCommand {
  public execute = vi.fn();

  protected readonly data: APIApplicationCommandSubcommandOption;

  constructor(parent: ParentCommand | SubCommandGroup, name?: string) {
    super(parent);
    this.data = new SlashCommandSubcommandBuilder()
      .setName(name ?? 'mock-subcommand')
      .setDescription('Mock subcommand')
      .toJSON();
  }

  public static createOnGroup() {
    const parent = new MockParentCommand();
    const group = new MockSubCommandGroup(parent);
    return new MockSubCommand(group);
  }

  public static createOnParent() {
    const parent = new MockParentCommand();
    return new MockSubCommand(parent);
  }
}
