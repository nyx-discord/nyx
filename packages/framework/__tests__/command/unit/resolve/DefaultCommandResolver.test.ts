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
import { MockSubCommandGroup } from '../../mocks/MockSubCommandGroup';

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

const createChatInputInteraction = (
  commandName: string,
  subcommandGroup?: string | null,
  subcommand?: string | null,
) => ({
  commandName,
  isChatInputCommand: vi.fn().mockReturnValue(true),
  isAutocomplete: vi.fn().mockReturnValue(false),
  options: {
    getSubcommandGroup: vi.fn().mockReturnValue(subcommandGroup ?? null),
    getSubcommand: vi.fn().mockReturnValue(subcommand ?? null),
  },
});

const createContextMenuInteraction = (commandName: string) => ({
  commandName,
  isChatInputCommand: vi.fn().mockReturnValue(false),
  isAutocomplete: vi.fn().mockReturnValue(false),
});

const createAutocompleteInteraction = (commandName: string) => ({
  commandName,
  isChatInputCommand: vi.fn().mockReturnValue(false),
  isAutocomplete: vi.fn().mockReturnValue(true),
  options: {
    getSubcommandGroup: vi.fn().mockReturnValue(null),
    getSubcommand: vi.fn().mockReturnValue(null),
  },
});

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

      const interaction = createChatInputInteraction(
        standalone.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(standalone);
    });

    test('GIVEN a chat input command with a parent THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const parent = new MockParentCommand();
      repo.addCommand(parent);

      const interaction = createChatInputInteraction(parent.getData().name);

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a chat input command with subcommand THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, subcommand } = setupParentWithSubcommand(repo);

      const interaction = createChatInputInteraction(
        parent.getData().name,
        null,
        subcommand.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN a chat input command with group and subcommand THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, group, subcommand } =
        setupParentWithGroupAndSubcommand(repo);

      const interaction = createChatInputInteraction(
        parent.getData().name,
        group.getData().name,
        subcommand.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN a chat input command with a group but no subcommand THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const { parent, group } = setupParentWithGroupAndSubcommand(repo);

      const interaction = createChatInputInteraction(
        parent.getData().name,
        group.getData().name,
        null,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a context menu interaction THEN finds a top-level executable', () => {
      const repo = createRepo();
      const resolver = createResolver();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const interaction = createContextMenuInteraction(
        standalone.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(standalone);
    });

    test('GIVEN a non-existing command THEN returns null', () => {
      const repo = createRepo();
      const resolver = createResolver();

      const interaction = createChatInputInteraction('nonexistent');

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

      const interaction = createAutocompleteInteraction(
        standalone.getData().name,
      );

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
