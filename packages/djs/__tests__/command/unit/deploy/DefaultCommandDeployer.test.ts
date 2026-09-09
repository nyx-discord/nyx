import {
  AssertionError,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/types';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { describe, expect, test, vi } from 'vitest';
import { DefaultCommandDeployer } from '../../../../src';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { StubApplicationCommand } from '../../mocks/StubApplicationCommand';
import { StubClient } from '../../mocks/StubClient';

describe('DefaultCommandDeployer', () => {
  test('GIVEN create THEN returns an instance', () => {
    const { client } = StubClient.create();
    expect(DefaultCommandDeployer.create(client as never)).toBeInstanceOf(
      DefaultCommandDeployer,
    );
  });

  describe('Guild & Global Batching', () => {
    test('GIVEN global commands THEN batches into global applicationManager.set without guild parameter', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockImplementation((datas: unknown[]) => {
          return Promise.resolve(
            new Map(
              (datas as Array<{ name: string; type?: number }>).map((data) => [
                data.name,
                StubApplicationCommand.create(
                  data.name,
                  data.type ?? ApplicationCommandType.ChatInput,
                ),
              ]),
            ),
          );
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const globalCmd1 = new MockStandaloneCommand('global-1', null);
      const globalCmd2 = new MockStandaloneCommand('global-2', null);

      await deployer.deployCommands(globalCmd1, globalCmd2);
      await deployer.deploy();

      expect(cmdMgr.set).toHaveBeenCalledTimes(1);
      expect(cmdMgr.set).toHaveBeenCalledWith([
        globalCmd1.getData(),
        globalCmd2.getData(),
      ]);
      expect(deployer.getMappings().size).toBe(2);
    });

    test('GIVEN guild commands THEN batches per guildId in applicationManager.set', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockImplementation((datas: unknown[]) => {
          return Promise.resolve(
            new Map(
              (datas as Array<{ name: string; type?: number }>).map((data) => [
                data.name,
                StubApplicationCommand.create(
                  data.name,
                  data.type ?? ApplicationCommandType.ChatInput,
                ),
              ]),
            ),
          );
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const guildCmdA1 = new MockStandaloneCommand('cmd-a1', ['guild-a']);
      const guildCmdA2 = new MockStandaloneCommand('cmd-a2', ['guild-a']);
      const guildCmdB1 = new MockStandaloneCommand('cmd-b1', ['guild-b']);

      await deployer.deployCommands(guildCmdA1, guildCmdA2, guildCmdB1);
      await deployer.deploy();

      expect(cmdMgr.set).toHaveBeenCalledTimes(2);
      expect(cmdMgr.set).toHaveBeenCalledWith(
        [guildCmdA1.getData(), guildCmdA2.getData()],
        'guild-a',
      );
      expect(cmdMgr.set).toHaveBeenCalledWith(
        [guildCmdB1.getData()],
        'guild-b',
      );
      expect(deployer.getMappings().size).toBe(3);
    });

    test('GIVEN mixed global and guild commands THEN batches global and each guild separately', async () => {
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockImplementation((datas: unknown[]) => {
          return Promise.resolve(
            new Map(
              (datas as Array<{ name: string; type?: number }>).map((data) => [
                data.name,
                StubApplicationCommand.create(
                  data.name,
                  data.type ?? ApplicationCommandType.ChatInput,
                ),
              ]),
            ),
          );
        }),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      const globalCmd = new MockStandaloneCommand('global-cmd', null);
      const guildCmd = new MockStandaloneCommand('guild-cmd', ['guild-123']);

      await deployer.deployCommands(globalCmd, guildCmd);
      await deployer.deploy();

      expect(cmdMgr.set).toHaveBeenCalledWith([globalCmd.getData()]);
      expect(cmdMgr.set).toHaveBeenCalledWith(
        [guildCmd.getData()],
        'guild-123',
      );
      expect(deployer.getMappings().size).toBe(2);
    });
  });

  describe('editCommands', () => {
    test('GIVEN editCommands THEN edits existing mappings on Discord and updates internal cache', async () => {
      const initialApp = StubApplicationCommand.create('mock-standalone');
      const editedApp = StubApplicationCommand.create('mock-standalone');
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map([['mock-standalone', initialApp]])),
        edit: vi.fn().mockResolvedValue(editedApp),
      });

      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(command);
      await deployer.deploy();

      expect(deployer.getMappings().get('mock-standalone')).toBe(initialApp);

      await deployer.editCommands(command);

      expect(cmdMgr.edit).toHaveBeenCalledWith(initialApp, command.getData());
      expect(deployer.getMappings().get('mock-standalone')).toBe(editedApp);
    });

    test('GIVEN editCommands for unknown command ID THEN throws ObjectNotFoundError', async () => {
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map()),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      await deployer.deploy();

      const unknownCommand = new MockStandaloneCommand('unknown-cmd');

      await expect(deployer.editCommands(unknownCommand)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });

    test('GIVEN editCommands while not started THEN throws IllegalStateError', async () => {
      const deployer = new DefaultCommandDeployer({
        application: null,
      } as never);
      const command = new MockStandaloneCommand();

      await expect(deployer.editCommands(command)).rejects.toThrow(
        IllegalStateError,
      );
    });
  });

  describe('removeCommands', () => {
    test('GIVEN removeCommands after deploy THEN invokes Discord delete API and cleans up internal mappings', async () => {
      const app = StubApplicationCommand.create('mock-standalone');
      const { client, cmdMgr } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map([['mock-standalone', app]])),
        delete: vi.fn().mockResolvedValue(undefined),
      });

      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(command);
      await deployer.deploy();

      expect(deployer.getMappings().has('mock-standalone')).toBe(true);

      await deployer.removeCommands(command);

      expect(cmdMgr.delete).toHaveBeenCalledWith(app);
      expect(deployer.getMappings().has('mock-standalone')).toBe(false);
      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN removeCommands after deploy with unknown command THEN throws ObjectNotFoundError', async () => {
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map()),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      await deployer.deploy();

      const unknownCommand = new MockStandaloneCommand('unknown');

      await expect(deployer.removeCommands(unknownCommand)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });

    test('GIVEN removeCommands pre-deploy THEN removes from pending array', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();
      await deployer.deployCommands(command);

      await deployer.removeCommands(command);

      expect(deployer.getMappings().size).toBe(0);
    });

    test('GIVEN removeCommands pre-deploy of unqueued command THEN throws AssertionError', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const command = new MockStandaloneCommand();

      await expect(deployer.removeCommands(command)).rejects.toThrow(
        AssertionError,
      );
    });
  });

  describe('setCommands', () => {
    test('GIVEN setCommands after deploy THEN resets command set and redeploys', async () => {
      const oldApp = StubApplicationCommand.create('old-cmd');
      const newApp = StubApplicationCommand.create('new-cmd');

      const { client, cmdMgr } = StubClient.create({
        set: vi.fn()
          .mockResolvedValueOnce(new Map([['old-cmd', oldApp]]))
          .mockResolvedValueOnce(new Map([['new-cmd', newApp]])),
      });

      const deployer = new DefaultCommandDeployer(client as never);
      const oldCommand = new MockStandaloneCommand('old-cmd');
      await deployer.deployCommands(oldCommand);
      await deployer.deploy();

      expect(deployer.getMappings().has('old-cmd')).toBe(true);

      const newCommand = new MockStandaloneCommand('new-cmd');
      await deployer.setCommands(newCommand);

      expect(deployer.getMappings().has('old-cmd')).toBe(false);
      expect(deployer.getMappings().has('new-cmd')).toBe(true);
      expect(deployer.getMappings().get('new-cmd')).toBe(newApp);
      expect(cmdMgr.set).toHaveBeenCalledTimes(2);
      expect(cmdMgr.set).toHaveBeenLastCalledWith([newCommand.getData()]);
    });

    test('GIVEN setCommands pre-deploy THEN replaces pending array', async () => {
      const { client } = StubClient.create();
      const deployer = new DefaultCommandDeployer(client as never);
      const cmd1 = new MockStandaloneCommand('cmd-1');
      const cmd2 = new MockStandaloneCommand('cmd-2');

      await deployer.deployCommands(cmd1);
      await deployer.setCommands(cmd2);

      expect(deployer.getMappings().size).toBe(0);
    });
  });

  describe('Mapping ApplicationCommand to TopLevelCommand', () => {
    test('GIVEN deployed commands THEN maps returned ApplicationCommand back to TopLevelCommand by matching name and type', async () => {
      const chatInputApp = StubApplicationCommand.create(
        'shared-name',
        ApplicationCommandType.ChatInput,
      );
      const userApp = StubApplicationCommand.create(
        'shared-name',
        ApplicationCommandType.User,
      );

      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue(
          new Map([
            ['shared-name-chat', chatInputApp],
            ['shared-name-user', userApp],
          ]),
        ),
      });

      const deployer = new DefaultCommandDeployer(client as never);
      const chatCmd = new MockStandaloneCommand(
        'shared-name',
        null,
        ApplicationCommandType.ChatInput,
      );
      // Give them different IDs
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
      );

      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map([['unassociated', unassociatedApp]])),
      });

      const deployer = new DefaultCommandDeployer(client as never);
      const registeredCmd = new MockStandaloneCommand('registered-name');

      await deployer.deployCommands(registeredCmd);

      await expect(deployer.deploy()).rejects.toThrow(ObjectNotFoundError);
    });
  });

  describe('lifecycle & iterators', () => {
    test('GIVEN deploy called twice THEN throws IllegalStateError', async () => {
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map()),
      });
      const deployer = new DefaultCommandDeployer(client as never);
      await deployer.deploy();

      await expect(deployer.deploy()).rejects.toThrow(IllegalStateError);
    });

    test('GIVEN deployed commands THEN supports iterable protocol (keys, values, entries, Symbol.iterator, next)', async () => {
      const app = StubApplicationCommand.create('mock-standalone');
      const { client } = StubClient.create({
        set: vi.fn().mockResolvedValue(new Map([['mock-standalone', app]])),
      });

      const deployer = new DefaultCommandDeployer(client as never);
      const cmd = new MockStandaloneCommand('mock-standalone');
      await deployer.deployCommands(cmd);
      await deployer.deploy();

      expect(Array.from(deployer.keys())).toEqual(['mock-standalone']);
      expect(Array.from(deployer.values())).toEqual([app]);
      expect(Array.from(deployer.entries())).toEqual([['mock-standalone', app]]);
      expect(Array.from(deployer)).toEqual([app]);
      expect(deployer.next().value).toBe(app);
    });
  });
});
