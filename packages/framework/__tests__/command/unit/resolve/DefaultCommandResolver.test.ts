import type { CommandCustomIdData, CommandRepository } from '@nyx-discord/core';
import { ApplicationCommandType } from 'discord.js';
import { describe, expect, it, test, vi } from 'vitest';
import {
  DefaultCommandRepository,
  DefaultCommandResolver,
} from '../../../../src';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubcommandGroup';

const createRepo = () => DefaultCommandRepository.create();
const createResolver = () => DefaultCommandResolver.create();

const setupParentWithSubcommand = (repo: CommandRepository) => {
  const parent = new MockParentCommand();
  const subcommand = new MockSubCommand(parent);
  parent.addChildren(subcommand);
  repo.addCommand(parent);
  return { parent, subcommand };
};

const setupParentWithGroupAndSubcommand = (repo: CommandRepository) => {
  const parent = new MockParentCommand();
  const group = new MockSubCommandGroup(parent);
  const subcommand = new MockSubCommand(group);
  group.addChildren(subcommand);
  parent.addChildren(group);
  repo.addCommand(parent);
  return { parent, group, subcommand };
};

describe('DefaultCommandResolver', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultCommandResolver.create()).toBeInstanceOf(
      DefaultCommandResolver,
    );
  });

  describe('resolveFromCommandInteraction', () => {
    test('GIVEN a chat input command with no group or subcommand THEN returns a standalone command', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const interaction = {
        commandName: standalone.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isAutocomplete: vi.fn().mockReturnValue(false),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(null),
          getSubcommand: vi.fn().mockReturnValue(null),
        },
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(standalone);
    });

    test('GIVEN a chat input command with a parent THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const parent = new MockParentCommand();
      repo.addCommand(parent);

      const interaction = {
        commandName: parent.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isAutocomplete: vi.fn().mockReturnValue(false),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(null),
          getSubcommand: vi.fn().mockReturnValue(null),
        },
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a chat input command with subcommand THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, subcommand } = setupParentWithSubcommand(repo);

      const interaction = {
        commandName: parent.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isAutocomplete: vi.fn().mockReturnValue(false),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(null),
          getSubcommand: vi.fn().mockReturnValue(subcommand.getData().name),
        },
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN a chat input command with group and subcommand THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, group, subcommand } =
        setupParentWithGroupAndSubcommand(repo);

      const interaction = {
        commandName: parent.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isAutocomplete: vi.fn().mockReturnValue(false),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(group.getData().name),
          getSubcommand: vi.fn().mockReturnValue(subcommand.getData().name),
        },
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN a chat input command with a group but no subcommand THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, group } = setupParentWithGroupAndSubcommand(repo);

      const interaction = {
        commandName: parent.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isAutocomplete: vi.fn().mockReturnValue(false),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(group.getData().name),
          getSubcommand: vi.fn().mockReturnValue(null),
        },
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a context menu interaction THEN finds a top-level executable', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const interaction = {
        commandName: standalone.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(false),
        isAutocomplete: vi.fn().mockReturnValue(false),
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(standalone);
    });

    test('GIVEN a non-existing command THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();

      const interaction = {
        commandName: 'nonexistent',
        isChatInputCommand: vi.fn().mockReturnValue(true),
        isAutocomplete: vi.fn().mockReturnValue(false),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(null),
          getSubcommand: vi.fn().mockReturnValue(null),
        },
      } as any;

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });
  });

  describe('resolveFromAutocompleteInteraction', () => {
    test('GIVEN an autocomplete interaction THEN delegates to resolveFromCommandInteraction', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const interaction = {
        commandName: standalone.getData().name,
        isChatInputCommand: vi.fn().mockReturnValue(false),
        isAutocomplete: vi.fn().mockReturnValue(true),
        options: {
          getSubcommandGroup: vi.fn().mockReturnValue(null),
          getSubcommand: vi.fn().mockReturnValue(null),
        },
      } as any;

      const result = resolver.resolveFromAutocompleteInteraction(
        interaction,
        repo,
      );

      expect(result).toBe(standalone);
    });
  });

  describe('resolveFromCustomIdData', () => {
    test('GIVEN data for a standalone chat input command THEN returns that command', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: standalone.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBe(standalone);
    });

    test('GIVEN data for a subcommand under a parent THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, subcommand } = setupParentWithSubcommand(repo);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: parent.getData().name,
        subcommand: subcommand.getData().name,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN data for a subcommand under a group under a parent THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, group, subcommand } =
        setupParentWithGroupAndSubcommand(repo);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: parent.getData().name,
        subcommand: subcommand.getData().name,
        group: group.getData().name,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN data with unknown command name THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: 'nonexistent',
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });

    test('GIVEN chat input data for a parent command (no subcommand) THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const parent = new MockParentCommand();
      repo.addCommand(parent);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: parent.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });
  });
});
