import { AssertionError, IllegalStateError } from '@nyx-discord/core';
import { ApplicationCommandType } from 'discord.js';
import { describe, expect, test, vi } from 'vitest';
import { DefaultCommandDeployer } from '../../../../src';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { StubClient } from '../../mocks/StubClient';

const createApplication = (name: string, type = 1) => ({
  name,
  type,
});

describe('DefaultCommandDeployer', () => {
  test('GIVEN create THEN returns an instance', () => {
    const { client } = StubClient.create();
    expect(DefaultCommandDeployer.create(client as never)).toBeInstanceOf(
      DefaultCommandDeployer,
    );
  });

  describe('pre-deploy state', () => {
    test('GIVEN deployCommands THEN pushes to pending array', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();

      await deployer.deployCommands(command);

      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN removeCommands THEN removes from pending array', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();
      await deployer.deployCommands(command);

      await deployer.removeCommands(command);

      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN removeCommands of unknown command THEN throws', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();

      await expect(deployer.removeCommands(command)).rejects.toThrow(
        AssertionError,
      );
    });

    test('GIVEN setCommands THEN replaces pending array', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();

      await deployer.setCommands(command);

      expect(deployer.getMappings().size).toBe(0);
    });
  });

  describe('post-deploy state', () => {
    test('GIVEN deploy THEN calls applicationManager.set and maps commands', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () =>
            [
              createApplication(
                'mock-standalone',
                ApplicationCommandType.ChatInput,
              ),
            ][Symbol.iterator](),
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();
      await deployer.deployCommands(command);

      await deployer.deploy();

      expect(cmdMgr.set).toHaveBeenCalled();
      expect(deployer.getMappings().size).toBe(1);
    });

    test('GIVEN deploy twice THEN throws IllegalStateError', async () => {
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () => [][Symbol.iterator](),
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      await deployer.deployCommands(new MockStandaloneCommand());
      await deployer.deploy();

      await expect(deployer.deploy()).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN removeCommands after deploy THEN calls applicationManager.delete', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () =>
            [
              createApplication(
                'mock-standalone',
                ApplicationCommandType.ChatInput,
              ),
            ][Symbol.iterator](),
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();
      await deployer.deployCommands(command);
      await deployer.deploy();

      await deployer.removeCommands(command);

      expect(cmdMgr.delete).toHaveBeenCalled();
      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN editCommands THEN calls applicationManager.edit', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () =>
            [
              createApplication(
                'mock-standalone',
                ApplicationCommandType.ChatInput,
              ),
            ][Symbol.iterator](),
        }),
        edit: vi.fn().mockResolvedValue(createApplication('edited-app')),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(command);
      await deployer.deploy();

      await deployer.editCommands(command);

      expect(cmdMgr.edit).toHaveBeenCalled();
      expect(deployer.getMappings().size).toBe(1);
    });

    test('GIVEN editCommands without application.commands THEN throws', async () => {
      const deployer = new DefaultCommandDeployer({
        application: null,
      } as never);
      const command = new MockStandaloneCommand();

      await expect(deployer.editCommands(command)).rejects.toThrow(
        IllegalStateError,
      );
    });

    test('GIVEN setCommands after deploy THEN clears and redeploys', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () =>
            [
              createApplication(
                'mock-standalone',
                ApplicationCommandType.ChatInput,
              ),
            ][Symbol.iterator](),
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();
      await deployer.deployCommands(command);
      await deployer.deploy();

      await deployer.setCommands(command);

      expect(deployer.getMappings().size).toBe(1);
      expect(cmdMgr.set).toHaveBeenCalled();
    });
  });

  describe('getMappings', () => {
    test('GIVEN a deployer THEN returns the mappings collection', () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);

      expect(deployer.getMappings()).toBeDefined();
      expect(deployer.getMappings().size).toBe(0);
    });
  });

  describe('iterators', () => {
    test('GIVEN deployed commands THEN keys yields IDs', async () => {
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () =>
            [
              createApplication(
                'mock-standalone',
                ApplicationCommandType.ChatInput,
              ),
            ][Symbol.iterator](),
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      await deployer.deployCommands(new MockStandaloneCommand());
      await deployer.deploy();

      const keys = Array.from(deployer.keys());

      expect(keys).toEqual(['mock-standalone']);
    });

    test('GIVEN deployed commands THEN entries yields ID-app pairs', async () => {
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue({
          values: () =>
            [
              createApplication(
                'mock-standalone',
                ApplicationCommandType.ChatInput,
              ),
            ][Symbol.iterator](),
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      await deployer.deployCommands(new MockStandaloneCommand());
      await deployer.deploy();

      const entries = Array.from(deployer.entries());

      expect(entries).toHaveLength(1);
      expect(entries[0]![0]).toBe('mock-standalone');
    });
  });
});
