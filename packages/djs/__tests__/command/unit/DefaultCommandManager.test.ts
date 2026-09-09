import {
  BasicEventBus,
  DefaultCommandCustomIdCodec,
  DefaultCommandRepository,
  DefaultMetadataFactory,
} from '@nyx-discord/base';
import { CommandEventEnum, IllegalStateError } from '@nyx-discord/types';
import { InteractionType } from 'discord.js';
import { describe, expect, test, vi } from 'vitest';
import {
  DefaultCommandDeployer,
  DefaultCommandExecutor,
  DefaultCommandManager,
  DefaultCommandResolver,
} from '../../../src';
import { MockParentCommand } from '../mocks/MockParentCommand';
import { MockStandaloneCommand } from '../mocks/MockStandaloneCommand';
import { MockSubCommandGroup } from '../mocks/MockSubCommandGroup';

function createManager(overrides: {
  repository?: any;
  executor?: any;
  customIdCodec?: any;
  resolver?: any;
  subscriptionsContainer?: any;
  deployer?: any;
  eventBus?: any;
  metaFactory?: any;
} = {}) {
  const repository = overrides.repository ?? DefaultCommandRepository.create();
  const executor = overrides.executor ?? {
    execute: vi.fn().mockResolvedValue(true),
    autocomplete: vi.fn().mockResolvedValue(undefined),
    getErrorHandler: vi.fn().mockReturnValue({ handle: vi.fn().mockResolvedValue(undefined) }),
  };
  const customIdCodec = overrides.customIdCodec ?? DefaultCommandCustomIdCodec.create();
  const resolver = overrides.resolver ?? DefaultCommandResolver.create();
  const subscriptionsContainer = overrides.subscriptionsContainer ?? {
    subscribe: vi.fn().mockResolvedValue(undefined),
    unsubscribe: vi.fn().mockResolvedValue(undefined),
  };
  const deployer = overrides.deployer ?? {
    deploy: vi.fn().mockResolvedValue(undefined),
    deployCommands: vi.fn().mockResolvedValue(undefined),
    removeCommands: vi.fn().mockResolvedValue(undefined),
    editCommands: vi.fn().mockResolvedValue(undefined),
    setCommands: vi.fn().mockResolvedValue(undefined),
    getMappings: vi.fn().mockReturnValue(new Map()),
  };
  const metaFactory = overrides.metaFactory ?? new DefaultMetadataFactory();
  const eventBus = overrides.eventBus ?? {
    emit: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn().mockResolvedValue(undefined),
    getSubscribers: vi.fn().mockReturnValue(new Map()),
    getMetadataFactory: vi.fn().mockReturnValue(new DefaultMetadataFactory()),
  };

  const manager = new DefaultCommandManager({
    repository,
    executor,
    customIdCodec,
    resolver,
    subscriptionsContainer,
    deployer,
    eventBus,
    metaFactory,
  });

  return {
    manager,
    repository,
    executor,
    customIdCodec,
    resolver,
    subscriptionsContainer,
    deployer,
    eventBus,
    metaFactory,
  };
}

describe('DefaultCommandManager', () => {
  describe('addCommands', () => {
    test('GIVEN commands THEN adds to repository, deploys via deployer, and emits CommandAdd event', async () => {
      const { manager, repository, deployer, eventBus } = createManager();
      const cmdA = new MockStandaloneCommand('cmd-a');
      const cmdB = new MockStandaloneCommand('cmd-b');

      const result = await manager.addCommands(cmdA, cmdB);

      expect(result).toBe(manager);
      expect(repository.getCommands().get(cmdA.getId())).toBe(cmdA);
      expect(repository.getCommands().get(cmdB.getId())).toBe(cmdB);
      expect(deployer.deployCommands).toHaveBeenCalledWith(cmdA, cmdB);
      expect(eventBus.emit).toHaveBeenCalledWith(CommandEventEnum.CommandAdd, [cmdA]);
      expect(eventBus.emit).toHaveBeenCalledWith(CommandEventEnum.CommandAdd, [cmdB]);
    });

    test('GIVEN deployer.deployCommands throws error THEN removes commands from repository and re-throws', async () => {
      const deployError = new Error('Deployment failed');
      const { manager, repository } = createManager({
        deployer: {
          deployCommands: vi.fn().mockRejectedValue(deployError),
          getMappings: vi.fn().mockReturnValue(new Map()),
        },
      });
      const cmd = new MockStandaloneCommand('failing-cmd');

      await expect(manager.addCommands(cmd)).rejects.toThrow(deployError);
      expect(repository.getCommands().get(cmd.getId())).toBeUndefined();
    });
  });

  describe('removeCommands', () => {
    test('GIVEN existing commands THEN removes from repository, undeploys via deployer, and emits CommandRemove event', async () => {
      const { manager, repository, deployer, eventBus } = createManager();
      const cmd = new MockStandaloneCommand('cmd-to-remove');
      repository.addCommand(cmd);

      const result = await manager.removeCommands(cmd);

      expect(result).toBe(manager);
      expect(repository.getCommands().get(cmd.getId())).toBeUndefined();
      expect(deployer.removeCommands).toHaveBeenCalledWith(cmd);
      expect(eventBus.emit).toHaveBeenCalledWith(CommandEventEnum.CommandRemove, [cmd]);
    });

    test('GIVEN deployer.removeCommands throws error THEN rolls back by re-adding command to repository and re-throws', async () => {
      const removeError = new Error('Undeployment failed');
      const { manager, repository } = createManager({
        deployer: {
          removeCommands: vi.fn().mockRejectedValue(removeError),
          getMappings: vi.fn().mockReturnValue(new Map()),
        },
      });
      const cmd = new MockStandaloneCommand('cmd-rollback');
      repository.addCommand(cmd);

      await expect(manager.removeCommands(cmd)).rejects.toThrow(removeError);
      expect(repository.getCommands().get(cmd.getId())).toBe(cmd);
    });
  });

  describe('editCommands', () => {
    test('GIVEN existing commands THEN updates repository and delegates to deployer.editCommands', async () => {
      const { manager, repository, deployer } = createManager();
      const cmd = new MockStandaloneCommand('cmd-edit');
      repository.addCommand(cmd);

      const result = await manager.editCommands(cmd);

      expect(result).toBe(manager);
      expect(repository.getCommands().get(cmd.getId())).toBe(cmd);
      expect(deployer.editCommands).toHaveBeenCalledWith(cmd);
    });
  });

  describe('setCommands', () => {
    test('GIVEN new commands THEN removes existing commands, adds new commands, emits events, and calls deployer.setCommands', async () => {
      const { manager, repository, deployer, eventBus } = createManager();
      const oldCmd = new MockStandaloneCommand('old-cmd');
      const newCmd = new MockStandaloneCommand('new-cmd');
      repository.addCommand(oldCmd);

      const result = await manager.setCommands(newCmd);

      expect(result).toBe(manager);
      expect(repository.getCommands().get(oldCmd.getId())).toBeUndefined();
      expect(repository.getCommands().get(newCmd.getId())).toBe(newCmd);
      expect(deployer.setCommands).toHaveBeenCalledWith(newCmd);
      expect(eventBus.emit).toHaveBeenCalledWith(CommandEventEnum.CommandRemove, [oldCmd]);
      expect(eventBus.emit).toHaveBeenCalledWith(CommandEventEnum.CommandAdd, [newCmd]);
    });
  });


  describe('execute', () => {
    test('GIVEN a chat input interaction THEN resolves command and executes via executor, emitting CommandRun', async () => {
      const { manager, repository, executor, eventBus } = createManager();
      const cmd = new MockStandaloneCommand('ping');
      repository.addCommand(cmd);

      const interaction = {
        id: 'interaction-1',
        type: InteractionType.ApplicationCommand,
        commandName: 'ping',
        isChatInputCommand: () => true,
        isAutocomplete: () => false,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
        },
        replied: false,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(true);
      expect(executor.execute).toHaveBeenCalledWith(cmd, interaction, expect.anything());
      expect(eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandRun,
        expect.arrayContaining([cmd, interaction]),
      );
    });

    test('GIVEN a component interaction with valid customId data THEN resolves command, decodes extra, and executes', async () => {
      const { manager, repository, executor, customIdCodec } = createManager();
      const cmd = new MockStandaloneCommand('button-cmd');
      repository.addCommand(cmd);

      const serialized = customIdCodec.serialize(cmd.getCustomIdData('extra-val'));
      const interaction = {
        id: 'interaction-2',
        type: InteractionType.MessageComponent,
        customId: serialized,
        replied: false,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(true);
      expect(executor.execute).toHaveBeenCalledWith(cmd, interaction, expect.anything());
    });

    test('GIVEN a component interaction with invalid customId string THEN returns false without executing', async () => {
      const { manager, executor } = createManager({
        customIdCodec: { deserialize: vi.fn().mockReturnValue(null) },
      });

      const interaction = {
        id: 'interaction-3',
        type: InteractionType.MessageComponent,
        customId: 'invalid-custom-id',
        replied: false,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
      expect(executor.execute).not.toHaveBeenCalled();
    });

    test('GIVEN a component interaction that resolves to a non-executable ParentCommand THEN rejects and returns false', async () => {
      const parentCmd = new MockParentCommand('parent-cmd');
      const { manager, executor, customIdCodec } = createManager({
        resolver: {
          resolveFromCustomIdData: vi.fn().mockReturnValue(parentCmd),
        },
      });

      const serialized = customIdCodec.serialize({
        type: 0,
        name: 'parent-cmd',
        extra: null,
        subcommand: null,
        group: null,
      });
      const interaction = {
        id: 'interaction-4',
        type: InteractionType.MessageComponent,
        customId: serialized,
        replied: false,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
      expect(executor.execute).not.toHaveBeenCalled();
    });

    test('GIVEN a component interaction resolving to a SubCommandGroup THEN rejects and returns false', async () => {
      const parent = new MockParentCommand('parent-cmd');
      const group = new MockSubCommandGroup(parent, 'group-cmd');
      const { manager, executor, customIdCodec } = createManager({
        resolver: {
          resolveFromCustomIdData: vi.fn().mockReturnValue(group),
        },
      });

      const serialized = customIdCodec.serialize({
        type: 0,
        name: 'group-cmd',
        extra: null,
        subcommand: null,
        group: null,
      });
      const interaction = {
        id: 'interaction-5',
        type: InteractionType.MessageComponent,
        customId: serialized,
        replied: false,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
      expect(executor.execute).not.toHaveBeenCalled();
    });

    test('GIVEN an interaction for an unknown / unresolvable command THEN returns false', async () => {
      const { manager, executor } = createManager();
      const interaction = {
        id: 'interaction-6',
        type: InteractionType.ApplicationCommand,
        commandName: 'unknown-cmd',
        isChatInputCommand: () => true,
        isAutocomplete: () => false,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
        },
        replied: false,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
      expect(executor.execute).not.toHaveBeenCalled();
    });

    test('GIVEN executor.execute throws an error THEN catches error, handles via errorHandler, and returns interaction.replied', async () => {
      const executeError = new Error('Execution boom');
      const errorHandler = { handle: vi.fn().mockResolvedValue(undefined) };
      const { manager, repository } = createManager({
        executor: {
          execute: vi.fn().mockRejectedValue(executeError),
          getErrorHandler: vi.fn().mockReturnValue(errorHandler),
        },
      });
      const cmd = new MockStandaloneCommand('failing-exec');
      repository.addCommand(cmd);

      const interaction = {
        id: 'interaction-7',
        type: InteractionType.ApplicationCommand,
        commandName: 'failing-exec',
        isChatInputCommand: () => true,
        isAutocomplete: () => false,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
        },
        replied: true,
      } as any;

      const result = await manager.execute(interaction);

      expect(result).toBe(true);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
    });
  });

  describe('autocomplete', () => {
    test('GIVEN autocomplete interaction for standalone command THEN resolves option, executes via executor, emits event, and returns responded flag', async () => {
      const { manager, repository, executor, eventBus } = createManager();
      const cmd = new MockStandaloneCommand('auto-cmd');
      repository.addCommand(cmd);

      const interaction = {
        id: 'autocomplete-1',
        type: InteractionType.ApplicationCommandAutocomplete,
        commandName: 'auto-cmd',
        isChatInputCommand: () => false,
        isAutocomplete: () => true,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
          getFocused: () => ({ name: 'query', value: 'hello' }),
        },
        responded: true,
      } as any;

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(true);
      expect(executor.autocomplete).toHaveBeenCalledWith(cmd, interaction, expect.anything());
      expect(eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandAutocomplete,
        expect.arrayContaining([cmd, interaction]),
      );
    });

    test('GIVEN autocomplete interaction for an unresolvable command THEN returns false', async () => {
      const { manager, executor } = createManager();
      const interaction = {
        id: 'autocomplete-2',
        type: InteractionType.ApplicationCommandAutocomplete,
        commandName: 'nonexistent',
        isChatInputCommand: () => false,
        isAutocomplete: () => true,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
          getFocused: () => ({ name: 'opt', value: '' }),
        },
        responded: false,
      } as any;

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(false);
      expect(executor.autocomplete).not.toHaveBeenCalled();
    });

    test('GIVEN autocomplete interaction for non-executable command THEN returns false', async () => {
      const { manager, repository, executor } = createManager();
      const parentCmd = new MockParentCommand('parent-auto');
      repository.addCommand(parentCmd);

      const interaction = {
        id: 'autocomplete-3',
        type: InteractionType.ApplicationCommandAutocomplete,
        commandName: 'parent-auto',
        isChatInputCommand: () => false,
        isAutocomplete: () => true,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
          getFocused: () => ({ name: 'opt', value: '' }),
        },
        responded: false,
      } as any;

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(false);
      expect(executor.autocomplete).not.toHaveBeenCalled();
    });

    test('GIVEN executor.autocomplete throws error THEN handles error via errorHandler and returns interaction.responded', async () => {
      const autoError = new Error('Autocomplete failure');
      const errorHandler = { handle: vi.fn().mockResolvedValue(undefined) };
      const { manager, repository } = createManager({
        executor: {
          autocomplete: vi.fn().mockRejectedValue(autoError),
          getErrorHandler: vi.fn().mockReturnValue(errorHandler),
        },
      });
      const cmd = new MockStandaloneCommand('failing-auto');
      repository.addCommand(cmd);

      const interaction = {
        id: 'autocomplete-4',
        type: InteractionType.ApplicationCommandAutocomplete,
        commandName: 'failing-auto',
        isChatInputCommand: () => false,
        isAutocomplete: () => true,
        isMessageComponent: () => false,
        isModalSubmit: () => false,
        isUserContextMenuCommand: () => false,
        isMessageContextMenuCommand: () => false,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
          getFocused: vi.fn().mockReturnValue({ name: 'opt', value: 'xyz' }),
        },
        responded: true,
      } as any;

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(true);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
    });

    test('GIVEN autocomplete interaction for SubCommand THEN resolves option, executes via executor, emits event, and returns true', async () => {
      const { manager, repository, executor, eventBus } = createManager();
      const parentCmd = new MockParentCommand('parent-auto-sub');
      const subCmd = new MockStandaloneCommand('subcmd'); 
      vi.spyOn(subCmd, 'isSubCommand').mockReturnValue(true);
      
      const resolver = manager.getResolver();
      vi.spyOn(resolver, 'resolveFromAutocompleteInteraction').mockReturnValue(subCmd);
      repository.addCommand(parentCmd);

      const interaction = {
        id: 'autocomplete-5',
        type: InteractionType.ApplicationCommandAutocomplete,
        commandName: 'parent-auto-sub',
        isChatInputCommand: () => false,
        isAutocomplete: () => true,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => 'subcmd',
          getFocused: vi.fn().mockReturnValue({ name: 'sub-query', value: 'hi' }),
        },
        responded: true,
      } as any;

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(true);
      expect(executor.autocomplete).toHaveBeenCalledWith(subCmd, interaction, expect.anything());
      expect(eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandAutocomplete,
        expect.arrayContaining([subCmd, interaction]),
      );
    });

    test('GIVEN getFocused throws an error THEN catches error, handles via errorHandler, and returns interaction.responded', async () => {
      const getFocusedError = new Error('getFocused failed');
      const errorHandler = { handle: vi.fn().mockResolvedValue(undefined) };
      const { manager, repository } = createManager({
        executor: {
          autocomplete: vi.fn(),
          getErrorHandler: vi.fn().mockReturnValue(errorHandler),
        },
      });
      const cmd = new MockStandaloneCommand('failing-focused');
      repository.addCommand(cmd);

      const interaction = {
        id: 'autocomplete-6',
        type: InteractionType.ApplicationCommandAutocomplete,
        commandName: 'failing-focused',
        isChatInputCommand: () => false,
        isAutocomplete: () => true,
        options: {
          getSubcommandGroup: () => null,
          getSubcommand: () => null,
          getFocused: vi.fn().mockImplementation(() => { throw getFocusedError; }),
        },
        responded: true,
      } as any;

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(true);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
    });
  });

  describe('lifecycle', () => {
    test('GIVEN onStart called THEN calls subscriptionsContainer.subscribe', async () => {
      const { manager, subscriptionsContainer } = createManager();
      await manager.onStart();
      expect(subscriptionsContainer.subscribe).toHaveBeenCalledOnce();
    });

    test('GIVEN onStop called THEN calls subscriptionsContainer.unsubscribe', async () => {
      const { manager, subscriptionsContainer } = createManager();
      await manager.onStop();
      expect(subscriptionsContainer.unsubscribe).toHaveBeenCalledOnce();
    });

    test('GIVEN deploy called THEN calls deployer.deploy', async () => {
      const { manager, deployer } = createManager();
      await manager.deploy();
      expect(deployer.deploy).toHaveBeenCalledOnce();
    });
  });

  describe('state guards', () => {
    test('GIVEN repository has commands WHEN setRepository called THEN throws IllegalStateError', () => {
      const { manager, repository } = createManager();
      repository.addCommand(new MockStandaloneCommand('guard-cmd'));

      const newRepo = DefaultCommandRepository.create();
      expect(() => manager.setRepository(newRepo)).toThrow(IllegalStateError);
    });

    test('GIVEN repository is empty WHEN setRepository called THEN updates repository successfully', () => {
      const { manager } = createManager();
      const newRepo = DefaultCommandRepository.create();

      manager.setRepository(newRepo);
      expect(manager.getRepository()).toBe(newRepo);
    });

    test('GIVEN deployer has mappings WHEN setDeployer called THEN throws IllegalStateError', () => {
      const { manager } = createManager({
        deployer: {
          getMappings: vi.fn().mockReturnValue(new Map([['cmd-id', {}]])),
        },
      });

      const newDeployer = DefaultCommandDeployer.create({} as any);
      expect(() => manager.setDeployer(newDeployer)).toThrow(IllegalStateError);
    });

    test('GIVEN deployer has no mappings WHEN setDeployer called THEN updates deployer successfully', () => {
      const { manager } = createManager();
      const newDeployer = DefaultCommandDeployer.create({} as any);

      manager.setDeployer(newDeployer);
      expect(manager.getDeployer()).toBe(newDeployer);
    });
  });

  describe('event bus and subscription migration', () => {

    test('GIVEN setSubscriptions THEN unsubscribes old container and sets new one', async () => {
      const { manager, subscriptionsContainer } = createManager();
      const newSubscriptions = {
        subscribe: vi.fn().mockResolvedValue(undefined),
        unsubscribe: vi.fn().mockResolvedValue(undefined),
      } as any;

      await manager.setSubscriptions(newSubscriptions);

      expect(subscriptionsContainer.unsubscribe).toHaveBeenCalledOnce();
      expect(manager.getSubscriptions()).toBe(newSubscriptions);
    });

    test('GIVEN setEventBus THEN transfers subscribers and metadata default fields, and sets new eventBus', async () => {
      const oldBus = BasicEventBus.createAsync<any>();
      const subscriber = {
        getId: () => 'sub-id',
        handleEvent: vi.fn(),
        getEvent: () => 'CommandAdd',
        getPriority: () => 0,
      } as any;
      await oldBus.subscribe(subscriber);

      const { manager } = createManager({ eventBus: oldBus });
      const newBus = BasicEventBus.createAsync<any>();

      await manager.setEventBus(newBus);

      expect(manager.getEventBus()).toBe(newBus);
      expect(newBus.isSubscribed(subscriber)).toBe(true);
    });

    test('GIVEN subscribe called THEN delegates to eventBus.subscribe', async () => {
      const { manager, eventBus } = createManager();
      const subscriber = {
        getId: () => 'sub-id',
        handleEvent: vi.fn(),
        getEvent: () => 'CommandAdd',
        getPriority: () => 0,
      } as any;

      const result = await manager.subscribe(subscriber);

      expect(result).toBe(manager);
      expect(eventBus.subscribe).toHaveBeenCalledWith(subscriber);
    });
  });
});
