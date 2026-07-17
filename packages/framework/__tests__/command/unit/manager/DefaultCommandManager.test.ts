import type { CommandCustomIdData, Metadata } from '@nyx-discord/core';
import { CommandEventEnum } from '@nyx-discord/core';
import { InteractionType } from 'discord.js';
import { describe, expect, test, vi } from 'vitest';
import {
  CommandCustomIdCodec,
  CommandDeployer,
  CommandExecutor,
  CommandResolver,
  CommandSubscriptionsContainer,
  DefaultCommandManager,
  DefaultCommandRepository,
} from '../../../../src';
import { StubEventBus } from '../../../event/mocks/StubEventBus';
import { StubEventSubscriber } from '../../../event/mocks/StubEventSubscriber';
import { MockStandaloneCommand } from '../../mocks/MockStandaloneCommand';
import { StubInteractionFactory } from '../../mocks/StubInteractionFactory';

const createOptions = () => {
  const repo = DefaultCommandRepository.create();

  const executor = {
    execute: vi.fn().mockResolvedValue(true),
    autocomplete: vi.fn().mockResolvedValue(undefined),
    getErrorHandler: vi.fn(),
    getMiddleware: vi.fn(),
  } satisfies CommandExecutor;

  const deployer = {
    deployCommands: vi.fn().mockResolvedValue(undefined),
    removeCommands: vi.fn().mockResolvedValue(undefined),
    editCommands: vi.fn().mockResolvedValue(undefined),
    setCommands: vi.fn().mockResolvedValue(undefined),
    deploy: vi.fn().mockResolvedValue(undefined),
    getMappings: vi.fn(),
    values: vi.fn(),
    keys: vi.fn(),
    entries: vi.fn(),
    next: vi.fn(),
    [Symbol.iterator]: vi.fn(),
  } satisfies CommandDeployer;

  const codec = {
    serialize: vi.fn().mockReturnValue('serialized'),
    deserialize: vi.fn().mockReturnValue(null),
  } satisfies CommandCustomIdCodec;

  const resolver = {
    resolveFromCommandInteraction: vi.fn().mockReturnValue(null),
    resolveFromAutocompleteInteraction: vi.fn().mockReturnValue(null),
    resolveFromCustomIdData: vi.fn().mockReturnValue(null),
  } satisfies CommandResolver;

  const subscriptions: CommandSubscriptionsContainer = {
    subscribe: vi.fn().mockResolvedValue(undefined),
    unsubscribe: vi.fn().mockResolvedValue(undefined),
    getInteractionSubscriber: vi.fn(),
    setAutocompleteSubscriber: vi.fn(),
    getAutocompleteSubscriber: vi.fn(),
    setInteractionSubscriber: vi.fn(),
  } satisfies CommandSubscriptionsContainer;

  const eventBus = StubEventBus.create();
  const metaFactory = {
    createOrPopulate: vi.fn(
      (meta: Metadata | undefined, id: symbol) =>
        meta ?? { [id.toString()]: {} },
    ),
    addDefaultField: vi.fn(),
  };

  return {
    repo,
    executor,
    deployer,
    codec,
    resolver,
    subscriptions,
    eventBus,
    metaFactory,
  };
};

const createManager = (
  overrides?: Partial<ReturnType<typeof createOptions>>,
) => {
  const opts = createOptions();
  Object.assign(opts, overrides);
  const {
    repo,
    executor,
    deployer,
    codec,
    resolver,
    subscriptions,
    eventBus,
    metaFactory,
  } = opts;
  return [
    new DefaultCommandManager({
      repository: repo,
      executor: executor as never,
      deployer: deployer as never,
      customIdCodec: codec as never,
      resolver: resolver as never,
      subscriptionsContainer: subscriptions as never,
      eventBus: eventBus as never,
      metaFactory: metaFactory as never,
    }),
    opts,
  ] as const;
};

describe('DefaultCommandManager', () => {
  describe('addCommands', () => {
    test('GIVEN valid commands THEN adds to repo, deploys, emits event', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();

      await manager.addCommands(command);

      expect(opts.repo.isCommandInstance(command)).toBe(true);
      expect(opts.deployer.deployCommands).toHaveBeenCalledWith(command);
      expect(opts.eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandAdd,
        [command],
      );
    });

    test('GIVEN deploy fails THEN rolls back repo and rethrows', async () => {
      const [manager, opts] = createManager({
        deployer: {
          ...createOptions().deployer,
          deployCommands: vi.fn().mockRejectedValue(new Error('deploy fail')),
        },
      });
      const command = new MockStandaloneCommand();

      await expect(manager.addCommands(command)).rejects.toThrow('deploy fail');
      expect(opts.repo.isCommandInstance(command)).toBe(false);
    });
  });

  describe('removeCommands', () => {
    test('GIVEN an existing command THEN removes from repo, undeploys, emits event', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();
      opts.repo.addCommand(command);

      await manager.removeCommands(command);

      expect(opts.repo.isCommandInstance(command)).toBe(false);
      expect(opts.deployer.removeCommands).toHaveBeenCalledWith(command);
      expect(opts.eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandRemove,
        [command],
      );
    });

    test('GIVEN undeploy fails THEN rolls back repo and rethrows', async () => {
      const [manager, opts] = createManager({
        deployer: {
          ...createOptions().deployer,
          removeCommands: vi.fn().mockRejectedValue(new Error('undeploy fail')),
        },
      });
      const command = new MockStandaloneCommand();
      opts.repo.addCommand(command);

      await expect(manager.removeCommands(command)).rejects.toThrow(
        'undeploy fail',
      );
      expect(opts.repo.isCommandInstance(command)).toBe(true);
    });
  });

  describe('editCommands', () => {
    test('GIVEN commands THEN updates repo and calls deployer.edit', async () => {
      const [manager, opts] = createManager();
      const old = new MockStandaloneCommand('old-cmd');
      const updated = new MockStandaloneCommand('old-cmd');
      opts.repo.addCommand(old);

      await manager.editCommands(updated);

      expect(opts.repo.isCommandInstance(old)).toBe(false);
      expect(opts.repo.isCommandInstance(updated)).toBe(true);
      expect(opts.deployer.editCommands).toHaveBeenCalledWith(updated);
    });
  });

  describe('setCommands', () => {
    test('GIVEN new commands THEN clears all existing, adds new, deploys', async () => {
      const [manager, opts] = createManager();
      const existing = new MockStandaloneCommand('existing');
      const replacement = new MockStandaloneCommand('replacement');
      opts.repo.addCommand(existing);

      await manager.setCommands(replacement);

      expect(opts.repo.isCommandInstance(existing)).toBe(false);
      expect(opts.repo.isCommandInstance(replacement)).toBe(true);
      expect(opts.deployer.setCommands).toHaveBeenCalledWith(replacement);
      expect(opts.eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandRemove,
        [existing],
      );
      expect(opts.eventBus.emit).toHaveBeenCalledWith(
        CommandEventEnum.CommandAdd,
        [replacement],
      );
    });
  });

  describe('execute', () => {
    test('GIVEN an application command interaction THEN resolves via command interaction', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();
      opts.resolver.resolveFromCommandInteraction.mockReturnValue(command);
      const interaction = Object.assign(
        StubInteractionFactory.createChatInput(),
        { type: InteractionType.ApplicationCommand },
      );

      const result = await manager.execute(interaction);

      expect(result).toBe(true);
      expect(opts.resolver.resolveFromCommandInteraction).toHaveBeenCalled();
      expect(opts.executor.execute).toHaveBeenCalledWith(
        command,
        interaction,
        expect.any(Object),
      );
    });

    test('GIVEN a component interaction THEN resolves via customId', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();
      const customIdData: CommandCustomIdData = {
        name: command.getData().name,
        type: 1,
        extra: null,
        subcommand: null,
        group: null,
      };
      opts.codec.deserialize.mockReturnValue(customIdData);
      opts.resolver.resolveFromCustomIdData.mockReturnValue(command);
      const interaction = Object.assign(StubInteractionFactory.createButton(), {
        type: InteractionType.MessageComponent,
        customId: 'some-custom-id',
      });

      const result = await manager.execute(interaction);

      expect(result).toBe(true);
      expect(opts.codec.deserialize).toHaveBeenCalledWith('some-custom-id');
      expect(opts.executor.execute).toHaveBeenCalled();
    });

    test('GIVEN deserialization fails THEN returns false', async () => {
      const [manager, opts] = createManager();
      opts.codec.deserialize.mockReturnValue(null);
      const interaction = Object.assign(StubInteractionFactory.createButton(), {
        type: InteractionType.MessageComponent,
        customId: 'bad-id',
      });

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
    });

    test('GIVEN executor throws THEN calls error handler', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();
      opts.resolver.resolveFromCommandInteraction.mockReturnValue(command);
      const errorHandler = { handle: vi.fn() };
      opts.executor.getErrorHandler.mockReturnValue(errorHandler);
      opts.executor.execute.mockRejectedValue(new Error('exec fail'));
      const interaction = Object.assign(
        StubInteractionFactory.createChatInput(),
        {
          type: InteractionType.ApplicationCommand,
          replied: false,
        },
      );

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
    });

    test('GIVEN resolver returns null THEN returns false', async () => {
      const [manager, opts] = createManager();
      opts.resolver.resolveFromCommandInteraction.mockReturnValue(null);
      const interaction = Object.assign(
        StubInteractionFactory.createChatInput(),
        { type: InteractionType.ApplicationCommand },
      );

      const result = await manager.execute(interaction);

      expect(result).toBe(false);
    });
  });

  describe('autocomplete', () => {
    test('GIVEN resolver returns null THEN returns false', async () => {
      const [manager, opts] = createManager();
      opts.resolver.resolveFromAutocompleteInteraction.mockReturnValue(null);
      const interaction = StubInteractionFactory.createAutocomplete();

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(false);
    });

    test('GIVEN a valid standalone command THEN calls executor.autocomplete', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();
      opts.resolver.resolveFromAutocompleteInteraction.mockReturnValue(command);
      const interaction = Object.assign(
        StubInteractionFactory.createAutocomplete(),
        {
          options: {
            getFocused: vi.fn().mockReturnValue({ name: 'opt', value: 'val' }),
          },
          responded: true,
        },
      );

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(true);
      expect(opts.executor.autocomplete).toHaveBeenCalled();
    });

    test('GIVEN executor throws THEN calls error handler and returns responded', async () => {
      const [manager, opts] = createManager();
      const command = new MockStandaloneCommand();
      opts.resolver.resolveFromAutocompleteInteraction.mockReturnValue(command);
      const errorHandler = { handle: vi.fn() };
      opts.executor.getErrorHandler.mockReturnValue(errorHandler);
      opts.executor.autocomplete.mockRejectedValue(
        new Error('autocomplete fail'),
      );
      const interaction = Object.assign(
        StubInteractionFactory.createAutocomplete(),
        {
          options: {
            getFocused: vi.fn().mockReturnValue({ name: 'opt', value: 'val' }),
          },
          responded: true,
        },
      );

      const result = await manager.autocomplete(interaction);

      expect(result).toBe(true);
      expect(errorHandler.handle).toHaveBeenCalledOnce();
    });
  });

  describe('getters', () => {
    test('GIVEN a manager THEN getExecutor returns the executor', () => {
      const [manager, opts] = createManager();
      expect(manager.getExecutor()).toBe(opts.executor);
    });

    test('GIVEN a manager THEN getRepository returns the repository', () => {
      const [manager, opts] = createManager();
      expect(manager.getRepository()).toBe(opts.repo);
    });

    test('GIVEN a manager THEN getResolver returns the resolver', () => {
      const [manager, opts] = createManager();
      expect(manager.getResolver()).toBe(opts.resolver);
    });

    test('GIVEN a manager THEN getCustomIdCodec returns the codec', () => {
      const [manager, opts] = createManager();
      expect(manager.getCustomIdCodec()).toBe(opts.codec);
    });

    test('GIVEN a manager THEN getDeployer returns the deployer', () => {
      const [manager, opts] = createManager();
      expect(manager.getDeployer()).toBe(opts.deployer);
    });

    test('GIVEN a manager THEN getEventBus returns the event bus', () => {
      const [manager, opts] = createManager();
      expect(manager.getEventBus()).toBe(opts.eventBus);
    });

    test('GIVEN a manager THEN getSubscriptions returns the container', () => {
      const [manager, opts] = createManager();
      expect(manager.getSubscriptions()).toBe(opts.subscriptions);
    });
  });

  describe('onStart / onStop', () => {
    test('GIVEN onStart THEN delegates to subscriptions', async () => {
      const [manager, opts] = createManager();

      await manager.onStart();

      expect(opts.subscriptions.subscribe).toHaveBeenCalled();
    });

    test('GIVEN onStop THEN delegates to subscriptions', () => {
      const [manager, opts] = createManager();

      manager.onStop();

      expect(opts.subscriptions.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    test('GIVEN subscribers THEN delegates to eventBus', async () => {
      const [manager, opts] = createManager();
      const subscriber = StubEventSubscriber.create();

      await manager.subscribe(subscriber);

      expect(opts.eventBus.subscribe).toHaveBeenCalledWith(subscriber);
    });
  });

  describe('deploy', () => {
    test('GIVEN deploy THEN delegates to deployer', async () => {
      const [manager, opts] = createManager();

      await manager.deploy();

      expect(opts.deployer.deploy).toHaveBeenCalled();
    });
  });
});
