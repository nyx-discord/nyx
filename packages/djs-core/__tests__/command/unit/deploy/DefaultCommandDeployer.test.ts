import {
  AssertionError,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/types';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { describe, expect, test, vi } from 'vitest';
import { DefaultCommandDeployer } from '../../../../src';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { StubApi } from '../../mocks/StubApi';
import { StubApplicationCommand } from '../../mocks/StubApplicationCommand';

const APP_ID = 'test-app-id';

describe('DefaultCommandDeployer (@discordjs/core)', () => {
  test('GIVEN create THEN returns an instance', () => {
    const { api } = StubApi.create();
    expect(DefaultCommandDeployer.create(api, APP_ID)).toBeInstanceOf(
      DefaultCommandDeployer,
    );
  });

  describe('Guild & Global Batching', () => {
    test('GIVEN global commands THEN batches into bulkOverwriteGlobalCommands', async () => {
      const { api, appCommands } = StubApi.create({
        bulkOverwriteGlobalCommands: vi
          .fn()
          .mockImplementation((_appId, datas: unknown[]) => {
            return Promise.resolve(
              (datas as Array<{ name: string; type?: number }>).map(
                (data, index) =>
                  StubApplicationCommand.create(
                    data.name,
                    data.type ?? ApplicationCommandType.ChatInput,
                    `global-id-${index}`,
                  ),
              ),
            );
          }),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const globalCmd1 = new MockStandaloneCommand('global-1', null);
      const globalCmd2 = new MockStandaloneCommand('global-2', null);

      await deployer.deployCommands(globalCmd1, globalCmd2);
      await deployer.deploy();

      expect(appCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledTimes(1);
      expect(appCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledWith(
        APP_ID,
        [globalCmd1.getData(), globalCmd2.getData()],
      );
      expect(deployer.getMappings().size).toBe(2);
    });

    test('GIVEN guild commands THEN batches per guildId in bulkOverwriteGuildCommands', async () => {
      const { api, appCommands } = StubApi.create({
        bulkOverwriteGuildCommands: vi
          .fn()
          .mockImplementation((_appId, guildId: string, datas: unknown[]) => {
            return Promise.resolve(
              (datas as Array<{ name: string; type?: number }>).map(
                (data, index) =>
                  StubApplicationCommand.create(
                    data.name,
                    data.type ?? ApplicationCommandType.ChatInput,
                    `guild-cmd-id-${index}`,
                    guildId,
                  ),
              ),
            );
          }),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const guildCmdA1 = new MockStandaloneCommand('cmd-a1', ['guild-a']);
      const guildCmdA2 = new MockStandaloneCommand('cmd-a2', ['guild-a']);
      const guildCmdB1 = new MockStandaloneCommand('cmd-b1', ['guild-b']);

      await deployer.deployCommands(guildCmdA1, guildCmdA2, guildCmdB1);
      await deployer.deploy();

      expect(appCommands.bulkOverwriteGuildCommands).toHaveBeenCalledTimes(2);
      expect(appCommands.bulkOverwriteGuildCommands).toHaveBeenCalledWith(
        APP_ID,
        'guild-a',
        [guildCmdA1.getData(), guildCmdA2.getData()],
      );
      expect(appCommands.bulkOverwriteGuildCommands).toHaveBeenCalledWith(
        APP_ID,
        'guild-b',
        [guildCmdB1.getData()],
      );
      expect(deployer.getMappings().size).toBe(3);
    });

    test('GIVEN mixed global and guild commands THEN batches global and each guild separately', async () => {
      const { api, appCommands } = StubApi.create({
        bulkOverwriteGlobalCommands: vi
          .fn()
          .mockImplementation((_appId, datas: unknown[]) => {
            return Promise.resolve(
              (datas as Array<{ name: string; type?: number }>).map(
                (data, index) =>
                  StubApplicationCommand.create(
                    data.name,
                    data.type ?? ApplicationCommandType.ChatInput,
                    `global-id-${index}`,
                  ),
              ),
            );
          }),
        bulkOverwriteGuildCommands: vi
          .fn()
          .mockImplementation((_appId, guildId: string, datas: unknown[]) => {
            return Promise.resolve(
              (datas as Array<{ name: string; type?: number }>).map(
                (data, index) =>
                  StubApplicationCommand.create(
                    data.name,
                    data.type ?? ApplicationCommandType.ChatInput,
                    `guild-id-${index}`,
                    guildId,
                  ),
              ),
            );
          }),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const globalCmd = new MockStandaloneCommand('global-cmd', null);
      const guildCmd = new MockStandaloneCommand('guild-cmd', ['guild-123']);

      await deployer.deployCommands(globalCmd, guildCmd);
      await deployer.deploy();

      expect(appCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledWith(
        APP_ID,
        [globalCmd.getData()],
      );
      expect(appCommands.bulkOverwriteGuildCommands).toHaveBeenCalledWith(
        APP_ID,
        'guild-123',
        [guildCmd.getData()],
      );
      expect(deployer.getMappings().size).toBe(2);
    });
  });

  describe('editCommands', () => {
    test('GIVEN editCommands on global command THEN calls editGlobalCommand and updates cache', async () => {
      const initialApp = StubApplicationCommand.create(
        'mock-standalone',
        ApplicationCommandType.ChatInput,
        'app-id-1',
      );
      const editedApp = StubApplicationCommand.create(
        'mock-standalone',
        ApplicationCommandType.ChatInput,
        'app-id-1',
      );

      const { api, appCommands } = StubApi.create({
        bulkOverwriteGlobalCommands: vi.fn().mockResolvedValue([initialApp]),
        editGlobalCommand: vi.fn().mockResolvedValue(editedApp),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const command = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(command);
      await deployer.deploy();

      expect(deployer.getMappings().get('mock-standalone')).toBe(initialApp);

      await deployer.editCommands(command);

      expect(appCommands.editGlobalCommand).toHaveBeenCalledWith(
        APP_ID,
        'app-id-1',
        command.getData(),
      );
      expect(deployer.getMappings().get('mock-standalone')).toBe(editedApp);
    });

    test('GIVEN editCommands on guild command THEN calls editGuildCommand and updates cache', async () => {
      const initialApp = StubApplicationCommand.create(
        'mock-guild-cmd',
        ApplicationCommandType.ChatInput,
        'guild-app-id',
        'guild-999',
      );
      const editedApp = StubApplicationCommand.create(
        'mock-guild-cmd',
        ApplicationCommandType.ChatInput,
        'guild-app-id',
        'guild-999',
      );

      const { api, appCommands } = StubApi.create({
        bulkOverwriteGuildCommands: vi.fn().mockResolvedValue([initialApp]),
        editGuildCommand: vi.fn().mockResolvedValue(editedApp),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const command = new MockStandaloneCommand('mock-guild-cmd', [
        'guild-999',
      ]);
      await deployer.deployCommands(command);
      await deployer.deploy();

      await deployer.editCommands(command);

      expect(appCommands.editGuildCommand).toHaveBeenCalledWith(
        APP_ID,
        'guild-999',
        'guild-app-id',
        command.getData(),
      );
      expect(deployer.getMappings().get('mock-guild-cmd')).toBe(editedApp);
    });

    test('GIVEN editCommands for unknown command ID THEN throws ObjectNotFoundError', async () => {
      const { api } = StubApi.create({
        bulkOverwriteGlobalCommands: vi.fn().mockResolvedValue([]),
      });
      const deployer = new DefaultCommandDeployer(api, APP_ID);
      await deployer.deploy();

      const unknownCommand = new MockStandaloneCommand('unknown-cmd');

      await expect(deployer.editCommands(unknownCommand)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('removeCommands', () => {
    test('GIVEN removeCommands after deploy for global command THEN calls deleteGlobalCommand and cleans cache', async () => {
      const app = StubApplicationCommand.create(
        'mock-standalone',
        ApplicationCommandType.ChatInput,
        'app-id-1',
      );
      const { api, appCommands } = StubApi.create({
        bulkOverwriteGlobalCommands: vi.fn().mockResolvedValue([app]),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const command = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(command);
      await deployer.deploy();

      expect(deployer.getMappings().has('mock-standalone')).toBe(true);

      await deployer.removeCommands(command);

      expect(appCommands.deleteGlobalCommand).toHaveBeenCalledWith(
        APP_ID,
        'app-id-1',
      );
      expect(deployer.getMappings().has('mock-standalone')).toBe(false);
      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN removeCommands after deploy for guild command THEN calls deleteGuildCommand and cleans cache', async () => {
      const app = StubApplicationCommand.create(
        'mock-guild-cmd',
        ApplicationCommandType.ChatInput,
        'guild-id-1',
        'guild-123',
      );
      const { api, appCommands } = StubApi.create({
        bulkOverwriteGuildCommands: vi.fn().mockResolvedValue([app]),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const command = new MockStandaloneCommand('mock-guild-cmd', [
        'guild-123',
      ]);
      await deployer.deployCommands(command);
      await deployer.deploy();

      await deployer.removeCommands(command);

      expect(appCommands.deleteGuildCommand).toHaveBeenCalledWith(
        APP_ID,
        'guild-123',
        'guild-id-1',
      );
      expect(deployer.getMappings().has('mock-guild-cmd')).toBe(false);
    });

    test('GIVEN removeCommands after deploy with unknown command THEN throws ObjectNotFoundError', async () => {
      const { api } = StubApi.create({
        bulkOverwriteGlobalCommands: vi.fn().mockResolvedValue([]),
      });
      const deployer = new DefaultCommandDeployer(api, APP_ID);
      await deployer.deploy();

      const unknownCommand = new MockStandaloneCommand('unknown');

      await expect(deployer.removeCommands(unknownCommand)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });

    test('GIVEN removeCommands pre-deploy THEN removes from pending array', async () => {
      const { api } = StubApi.create();
      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const command = new MockStandaloneCommand();
      await deployer.deployCommands(command);

      await deployer.removeCommands(command);

      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN removeCommands pre-deploy of unqueued command THEN throws AssertionError', async () => {
      const { api } = StubApi.create();
      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const command = new MockStandaloneCommand();

      await expect(deployer.removeCommands(command)).rejects.toThrow(
        AssertionError,
      );
    });
  });

  describe('setCommands', () => {
    test('GIVEN setCommands after deploy THEN resets command set and redeploys', async () => {
      const oldApp = StubApplicationCommand.create(
        'old-cmd',
        ApplicationCommandType.ChatInput,
        'old-id',
      );
      const newApp = StubApplicationCommand.create(
        'new-cmd',
        ApplicationCommandType.ChatInput,
        'new-id',
      );

      const { api, appCommands } = StubApi.create({
        bulkOverwriteGlobalCommands: vi
          .fn()
          .mockResolvedValueOnce([oldApp])
          .mockResolvedValueOnce([newApp]),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const oldCommand = new MockStandaloneCommand('old-cmd');
      await deployer.deployCommands(oldCommand);
      await deployer.deploy();

      expect(deployer.getMappings().has('old-cmd')).toBe(true);

      const newCommand = new MockStandaloneCommand('new-cmd');
      await deployer.setCommands(newCommand);

      expect(deployer.getMappings().has('old-cmd')).toBe(false);
      expect(deployer.getMappings().has('new-cmd')).toBe(true);
      expect(deployer.getMappings().get('new-cmd')).toBe(newApp);
      expect(appCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledTimes(2);
      expect(appCommands.bulkOverwriteGlobalCommands).toHaveBeenLastCalledWith(
        APP_ID,
        [newCommand.getData()],
      );
    });

    test('GIVEN setCommands pre-deploy THEN replaces pending array', async () => {
      const { api } = StubApi.create();
      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const cmd1 = new MockStandaloneCommand('cmd-1');
      const cmd2 = new MockStandaloneCommand('cmd-2');

      await deployer.deployCommands(cmd1);
      await deployer.setCommands(cmd2);

      expect(deployer.getMappings().size).toBe(0);
    });
  });

  describe('Mapping APIApplicationCommand to TopLevelCommand', () => {
    test('GIVEN deployed commands THEN maps returned APIApplicationCommand back to TopLevelCommand by matching name and type', async () => {
      const chatInputApp = StubApplicationCommand.create(
        'shared-name',
        ApplicationCommandType.ChatInput,
        'chat-id',
      );
      const userApp = StubApplicationCommand.create(
        'shared-name',
        ApplicationCommandType.User,
        'user-id',
      );

      const { api } = StubApi.create({
        bulkOverwriteGlobalCommands: vi
          .fn()
          .mockResolvedValue([chatInputApp, userApp]),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const chatCmd = new MockStandaloneCommand(
        'shared-name',
        null,
        ApplicationCommandType.ChatInput,
      );
      vi.spyOn(chatCmd, 'getId').mockReturnValue('cmd-chat');

      const userCmd = new MockStandaloneCommand(
        'shared-name',
        null,
        ApplicationCommandType.User,
      );
      vi.spyOn(userCmd, 'getId').mockReturnValue('cmd-user');

      await deployer.deployCommands(chatCmd, userCmd);
      await deployer.deploy();

      expect(deployer.getMappings().get('cmd-chat')).toBe(chatInputApp);
      expect(deployer.getMappings().get('cmd-user')).toBe(userApp);
    });

    test('GIVEN an application returned with no matching command THEN throws ObjectNotFoundError', async () => {
      const unassociatedApp = StubApplicationCommand.create(
        'unassociated-name',
        ApplicationCommandType.ChatInput,
        'unassociated-id',
      );

      const { api } = StubApi.create({
        bulkOverwriteGlobalCommands: vi
          .fn()
          .mockResolvedValue([unassociatedApp]),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const registeredCmd = new MockStandaloneCommand('registered-name');

      await deployer.deployCommands(registeredCmd);

      await expect(deployer.deploy()).rejects.toThrow(ObjectNotFoundError);
    });
  });

  describe('lifecycle & iterators', () => {
    test('GIVEN deploy called twice THEN throws IllegalStateError', async () => {
      const { api } = StubApi.create({
        bulkOverwriteGlobalCommands: vi.fn().mockResolvedValue([]),
      });
      const deployer = new DefaultCommandDeployer(api, APP_ID);
      await deployer.deploy();

      await expect(deployer.deploy()).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN deployed commands THEN supports iterable protocol (keys, values, entries, Symbol.iterator, next)', async () => {
      const app = StubApplicationCommand.create(
        'mock-standalone',
        ApplicationCommandType.ChatInput,
        'mock-id',
      );
      const { api } = StubApi.create({
        bulkOverwriteGlobalCommands: vi.fn().mockResolvedValue([app]),
      });

      const deployer = new DefaultCommandDeployer(api, APP_ID);
      const cmd = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(cmd);
      await deployer.deploy();

      expect(Array.from(deployer.keys())).toEqual(['mock-standalone']);
      expect(Array.from(deployer.values())).toEqual([app]);
      expect(Array.from(deployer.entries())).toEqual([
        ['mock-standalone', app],
      ]);
      expect(Array.from(deployer)).toEqual([app]);
      expect(deployer.next().value).toBe(app);
    });
  });
});
