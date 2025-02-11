import { DefaultCommandRepository } from '../../../../src';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubcommandGroup';

const createRepo = () => DefaultCommandRepository.create();

describe('DefaultCommandRepository', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultCommandRepository.create()).toBeInstanceOf(
      DefaultCommandRepository,
    );
  });

  describe('Storage', () => {
    test("GIVEN no input THEN it's empty", () => {
      const repo = createRepo();
      expect(repo.size).toBe(0);
      expect(repo.getCommands().size).toBe(0);
    });

    test("GIVEN a command THEN it's stored", () => {
      const repo = createRepo();
      const command = new MockStandaloneCommand();

      repo.addCommand(command);

      expect(repo.size).toBe(1);
      expect(repo.getCommands().size).toBe(1);
      expect(repo.getCommands().has(command.getId())).toBe(true);
      expect(repo.isCommandId(command.getId())).toBe(true);
      expect(repo.isCommandInstance(command)).toBe(true);

      const name = command.getData().name;
      expect(repo.getCommandByName(name)).toBe(command);
    });

    test('GIVEN a command is removed THEN all references are cleaned up', () => {
      const repo = createRepo();
      const command = new MockStandaloneCommand();

      repo.addCommand(command);
      repo.removeCommand(command);

      expect(repo.size).toBe(0);
      expect(repo.getCommands().size).toBe(0);
      expect(repo.getCommands().has(command.getId())).toBe(false);
      expect(repo.isCommandId(command.getId())).toBe(false);
      expect(repo.isCommandInstance(command)).toBe(false);

      const name = command.getData().name;
      expect(repo.getCommandByName(name)).toBe(null);
    });

    test('GIVEN a duplicate command THEN it throws', () => {
      const repo = createRepo();
      const command = new MockStandaloneCommand();
      repo.addCommand(command);
      expect(() => repo.addCommand(command)).toThrow();
    });

    test('GIVEN a non existing command THEN removing it throws', () => {
      const repo = createRepo();
      expect(() => repo.removeCommand(new MockStandaloneCommand())).toThrow();
    });
  });

  describe('Class Location', () => {
    test('GIVEN a top level command THEN it can be class located', () => {
      const repo = createRepo();
      const standalone = new MockStandaloneCommand();

      expect(repo.locateByClassTree(MockStandaloneCommand)).toBe(null);
      repo.addCommand(standalone);
      expect(repo.locateByClassTree(MockStandaloneCommand)).toBe(standalone);

      const parent = new MockParentCommand();

      expect(repo.locateByClassTree(MockParentCommand)).toBe(null);
      repo.addCommand(parent);
      expect(repo.locateByClassTree(MockParentCommand)).toBe(parent);
    });

    test('GIVEN a subcommand in parent THEN both can be class located', () => {
      const repo = createRepo();
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      expect(repo.locateByClassTree(MockParentCommand, MockSubCommand)).toBe(
        null,
      );
      expect(repo.locateByClassTree(MockParentCommand)).toBe(null);
      repo.addCommand(parent);
      expect(repo.locateByClassTree(MockParentCommand, MockSubCommand)).toBe(
        subcommand,
      );
      expect(repo.locateByClassTree(MockParentCommand)).toBe(parent);
    });

    test('GIVEN a subcommand in group in parent THEN all can be class located', () => {
      const repo = createRepo();
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      const subcommand = new MockSubCommand(group);
      group.addChildren(subcommand);
      parent.addChildren(group);

      expect(repo.locateByClassTree(MockParentCommand)).toBe(null);
      repo.addCommand(parent);

      expect(repo.locateByClassTree(MockParentCommand)).toBe(parent);
      expect(
        repo.locateByClassTree(MockParentCommand, MockSubCommandGroup),
      ).toBe(group);
      expect(repo.locateByClassTree(MockParentCommand, MockSubCommand)).toBe(
        null,
      );
      expect(
        repo.locateByClassTree(
          MockParentCommand,
          MockSubCommandGroup,
          MockSubCommand,
        ),
      ).toBe(subcommand);
    });
  });

  describe('Name Location', () => {
    test('GIVEN a top level command THEN it can be name located', () => {
      const repo = createRepo();
      const standalone = new MockStandaloneCommand();

      expect(repo.locateByNameTree(standalone.getData().name)).toBe(null);
      repo.addCommand(standalone);
      expect(repo.getCommandByName(standalone.getData().name)).toBe(standalone);
    });

    test('GIVEN a subcommand in parent THEN both can be name located', () => {
      const repo = createRepo();
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      expect(repo.locateByNameTree(parent.getData().name)).toBe(null);
      repo.addCommand(parent);
      expect(repo.locateByNameTree(parent.getData().name)).toBe(parent);
      expect(
        repo.locateByNameTree(parent.getData().name, subcommand.getData().name),
      ).toBe(subcommand);
    });

    test('GIVEN a subcommand in group in parent THEN all can be name located', () => {
      const repo = createRepo();
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      const subcommand = new MockSubCommand(group);
      group.addChildren(subcommand);
      parent.addChildren(group);

      expect(repo.locateByNameTree(parent.getData().name)).toBe(null);
      repo.addCommand(parent);

      expect(repo.locateByNameTree(parent.getData().name)).toBe(parent);
      expect(
        repo.locateByNameTree(parent.getData().name, group.getData().name),
      ).toBe(group);
      expect(
        repo.locateByNameTree(
          parent.getData().name,
          group.getData().name,
          subcommand.getData().name,
        ),
      ).toBe(subcommand);
    });
  });

  describe('CustomId Location', () => {
    test('GIVEN a top level command THEN it can be custom id located', () => {
      const repo = createRepo();
      const standalone = new MockStandaloneCommand();
      const data = standalone.getCustomIdData();

      expect(repo.locateExecutableByCustomIdData(data)).toBe(null);
      repo.addCommand(standalone);
      expect(repo.locateExecutableByCustomIdData(data)).toBe(standalone);
    });

    test('GIVEN a subcommand in parent THEN the subcommand can be custom id located', () => {
      const repo = createRepo();
      const parent = new MockParentCommand();
      const subcommand = new MockSubCommand(parent);
      parent.addChildren(subcommand);

      expect(
        repo.locateExecutableByCustomIdData(subcommand.getCustomIdData()),
      ).toBe(null);
      repo.addCommand(parent);
      expect(
        repo.locateExecutableByCustomIdData(subcommand.getCustomIdData()),
      ).toBe(subcommand);
    });

    test('GIVEN a subcommand in group in parent THEN the subcommand can be custom id located', () => {
      const repo = createRepo();
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      const subcommand = new MockSubCommand(group);
      group.addChildren(subcommand);
      parent.addChildren(group);

      expect(
        repo.locateExecutableByCustomIdData(subcommand.getCustomIdData()),
      ).toBe(null);
      repo.addCommand(parent);
      expect(
        repo.locateExecutableByCustomIdData(subcommand.getCustomIdData()),
      ).toBe(subcommand);
    });
  });
});
