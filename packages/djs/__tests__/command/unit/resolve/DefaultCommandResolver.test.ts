import { DefaultCommandRepository } from '@nyx-discord/base';
import type { CommandCustomIdData } from '@nyx-discord/types';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { describe, expect, it, test, vi } from 'vitest';
import { DefaultCommandResolver } from '../../../../src';
import type { DjsInteractionTypes } from '../../../../src/types/DjsInteractionTypes.js';
import { MockContextMenuCommand } from '../../mocks/MockContextMenuCommand';
import { MockParentCommand } from '../../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { MockSubCommand } from '../../mocks/MockSubCommand';
import { MockSubCommandGroup } from '../../mocks/MockSubCommandGroup';
import { StubInteraction } from '../../mocks/StubInteraction';

const createRepo = () => new DefaultCommandRepository<DjsInteractionTypes>();

const setupParentWithSubcommand = (
  repo: DefaultCommandRepository<DjsInteractionTypes>,
) => {
  const parent = new MockParentCommand();
  const subcommand = new MockSubCommand(parent);
  parent.addChildren(subcommand);
  repo.addCommand(parent);
  return { parent, subcommand };
};

const setupParentWithGroupAndSubcommand = (
  repo: DefaultCommandRepository<DjsInteractionTypes>,
) => {
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
      const resolver = DefaultCommandResolver.create();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const interaction = StubInteraction.createChatInput(
        standalone.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(standalone);
    });

    test('GIVEN a chat input command with a parent THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const parent = new MockParentCommand();
      repo.addCommand(parent);

      const interaction = StubInteraction.createChatInput(parent.getData().name);

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a chat input command with subcommand THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const { parent, subcommand } = setupParentWithSubcommand(repo);

      const interaction = StubInteraction.createChatInput(
        parent.getData().name,
        null,
        subcommand.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN a chat input command with group and subcommand THEN returns the subcommand', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const { parent, group, subcommand } =
        setupParentWithGroupAndSubcommand(repo);

      const interaction = StubInteraction.createChatInput(
        parent.getData().name,
        group.getData().name,
        subcommand.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(subcommand);
    });

    test('GIVEN a chat input command with a group but no subcommand THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const { parent, group } = setupParentWithGroupAndSubcommand(repo);

      const interaction = StubInteraction.createChatInput(
        parent.getData().name,
        group.getData().name,
        null,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a chat input command where subcommand is actually a group THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      parent.addChildren(group);
      repo.addCommand(parent);

      // interaction specifies group name as subcommand name (without a subcommand group)
      const interaction = StubInteraction.createChatInput(
        parent.getData().name,
        null,
        group.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a context menu interaction for user command THEN finds top-level executable', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const userCmd = new MockContextMenuCommand(
        'user-cmd',
        ApplicationCommandType.User,
      );
      repo.addCommand(userCmd);

      const interaction = StubInteraction.createContextMenu(
        userCmd.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(userCmd);
    });

    test('GIVEN a context menu interaction for message command THEN finds top-level executable', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const messageCmd = new MockContextMenuCommand(
        'message-cmd',
        ApplicationCommandType.Message,
      );
      repo.addCommand(messageCmd);

      const interaction = StubInteraction.createContextMenu(
        messageCmd.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBe(messageCmd);
    });

    test('GIVEN a context menu interaction for parent command THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const parent = new MockParentCommand();
      repo.addCommand(parent);

      const interaction = StubInteraction.createContextMenu(
        parent.getData().name,
      );

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });

    test('GIVEN a non-existing command THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();

      const interaction = StubInteraction.createChatInput('nonexistent');

      const result = resolver.resolveFromCommandInteraction(interaction, repo);

      expect(result).toBeNull();
    });
  });

  describe('resolveFromAutocompleteInteraction', () => {
    test('GIVEN an autocomplete interaction with standalone command THEN resolves standalone command', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const interaction = StubInteraction.createAutocomplete(
        standalone.getData().name,
      );

      const result = resolver.resolveFromAutocompleteInteraction(
        interaction,
        repo,
      );

      expect(result).toBe(standalone);
    });

    test('GIVEN an autocomplete interaction with group and subcommand THEN resolves subcommand', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const { parent, group, subcommand } =
        setupParentWithGroupAndSubcommand(repo);

      const interaction = StubInteraction.createAutocomplete(
        parent.getData().name,
        group.getData().name,
        subcommand.getData().name,
      );

      const result = resolver.resolveFromAutocompleteInteraction(
        interaction,
        repo,
      );

      expect(result).toBe(subcommand);
    });

    test('GIVEN an autocomplete interaction with subcommand under parent THEN resolves subcommand', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const { parent, subcommand } = setupParentWithSubcommand(repo);

      const interaction = StubInteraction.createAutocomplete(
        parent.getData().name,
        null,
        subcommand.getData().name,
      );

      const result = resolver.resolveFromAutocompleteInteraction(
        interaction,
        repo,
      );

      expect(result).toBe(subcommand);
    });

    test('GIVEN an autocomplete interaction for nonexistent command THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();

      const interaction = StubInteraction.createAutocomplete('nonexistent');

      const result = resolver.resolveFromAutocompleteInteraction(
        interaction,
        repo,
      );

      expect(result).toBeNull();
    });
  });

  describe('resolveFromCustomIdData', () => {
    test('GIVEN data for a standalone chat input command THEN returns that command', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
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
      const resolver = DefaultCommandResolver.create();
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
      const resolver = DefaultCommandResolver.create();
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
      const resolver = DefaultCommandResolver.create();

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
      const resolver = DefaultCommandResolver.create();
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

    test('GIVEN chat input data with subcommand on a standalone command THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: standalone.getData().name,
        subcommand: 'sub',
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });

    test('GIVEN chat input data where child is not found under parent THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const parent = new MockParentCommand();
      repo.addCommand(parent);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: parent.getData().name,
        subcommand: 'nonexistent-child',
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });

    test('GIVEN chat input data with group where subcommand is not found under group THEN returns undefined/null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const parent = new MockParentCommand();
      const group = new MockSubCommandGroup(parent);
      parent.addChildren(group);
      repo.addCommand(parent);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.ChatInput,
        name: parent.getData().name,
        subcommand: 'nonexistent-sub',
        group: group.getData().name,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeFalsy();
    });

    test('GIVEN user context menu data matching User command THEN returns command', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const userCmd = new MockContextMenuCommand(
        'user-cmd',
        ApplicationCommandType.User,
      );
      repo.addCommand(userCmd);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.User,
        name: userCmd.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBe(userCmd);
    });

    test('GIVEN user context menu data when top-level is not User type THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const messageCmd = new MockContextMenuCommand(
        'message-cmd',
        ApplicationCommandType.Message,
      );
      repo.addCommand(messageCmd);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.User,
        name: messageCmd.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });

    test('GIVEN message context menu data matching Message command THEN returns command', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const messageCmd = new MockContextMenuCommand(
        'message-cmd',
        ApplicationCommandType.Message,
      );
      repo.addCommand(messageCmd);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.Message,
        name: messageCmd.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBe(messageCmd);
    });

    test('GIVEN message context menu data when top-level is not Message type THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const userCmd = new MockContextMenuCommand(
        'user-cmd',
        ApplicationCommandType.User,
      );
      repo.addCommand(userCmd);

      const data: CommandCustomIdData = {
        type: ApplicationCommandType.Message,
        name: userCmd.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });

    test('GIVEN unsupported command type THEN returns null', () => {
      const repo = createRepo();
      const resolver = DefaultCommandResolver.create();
      const standalone = new MockStandaloneCommand();
      repo.addCommand(standalone);

      const data = {
        type: 999 as unknown as ApplicationCommandType,
        name: standalone.getData().name,
        subcommand: null,
        group: null,
        extra: null,
      };

      const result = resolver.resolveFromCustomIdData(data, repo);

      expect(result).toBeNull();
    });
  });
});
