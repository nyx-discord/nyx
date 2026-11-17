import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';

describe('BaseSubCommand (getData)', () => {
  test('GIVEN data without a type WHEN getData is called THEN adds the subcommand type', () => {
    const subCommand = new MockSubCommand(new MockParentCommand(), 'view');

    expect(subCommand.getData()).toEqual({
      name: 'view',
      description: 'Mock subcommand',
      type: ApplicationCommandOptionType.Subcommand,
    });
  });

  test('GIVEN data with a wrong type WHEN getData is called THEN overrides it with the subcommand type', () => {
    class WrongTypeSubCommand extends MockSubCommand {
      protected override readonly data = {
        name: 'view',
        description: 'Mock subcommand',
        type: ApplicationCommandOptionType.SubcommandGroup as never,
      };
    }
    const subCommand = new WrongTypeSubCommand(new MockParentCommand());

    expect(subCommand.getData().type).toBe(
      ApplicationCommandOptionType.Subcommand,
    );
  });
});
