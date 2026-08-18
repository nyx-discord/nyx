import type { Client, MappedEvents } from '@discordjs/core';
import {
  BaseBot,
  BasicEventEmitterBus,
  DefaultBotService,
  DefaultMetadataFactory,
  DefaultPluginManager,
  DefaultScheduleManager,
} from '@nyx-discord/base';
import type {
  BotOptions,
  InjectableBotDependencies,
  NyxBot,
} from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import type { CoreNyxClient } from '../client/CoreNyxClient.js';
import { DefaultCommandManager } from '../features/command/DefaultCommandManager.js';
import type { CoreInteractionTypes } from '../types/CoreInteractionTypes.js';

// Base dependencies injected to the BaseBot for the getter return types
type CoreBotDependencies = InjectableBotDependencies<
  CoreInteractionTypes,
  CoreNyxClient,
  MappedEvents
>;

// Required return type for the generator callback in .create(), partializes most
// options but requires the user to provide required ones (logger, client, etc)
type CoreBotOptionsWithDefaults<
  Implementations extends Partial<CoreBotDependencies>,
> = Implementations
  & Pick<
    BotOptions<CoreBotDependencies>,
    'logger' | 'client' | 'token' | 'deployCommands'
  >;

/** The @discordjs/core Bot. */
export class CoreBot<
  Implementations extends CoreBotDependencies = CoreBotDependencies,
> extends BaseBot<Implementations> {
  public static create<Implementations extends Partial<CoreBotDependencies>>(
    generator: (bot: NyxBot) => CoreBotOptionsWithDefaults<Implementations>,
  ): NyxBot<CoreBotDependencies & Implementations> {
    return new this((bot) => {
      const generatedOptions = generator(bot);
      const defaultOptions = CoreBot.DefaultOptionsGenerator(
        bot,
        generatedOptions.client,
      );

      return {
        ...defaultOptions,
        ...generatedOptions,
      };
    });
  }

  public static readonly DefaultOptionsGenerator = (
    bot: NyxBot,
    client: CoreNyxClient,
  ) => {
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]);
    const clientBus = BasicEventEmitterBus.createSyncWithEmitter<
      MappedEvents,
      Client
    >(client.getEmitter(), metaFactory);

    return {
      clientEventBus: clientBus,
      commandManager: DefaultCommandManager.create({
        bot,
        client,
        clientBus,
      }),
      scheduleManager: DefaultScheduleManager.create({ bot }),
      service: DefaultBotService.create({ bot }),
      pluginManager: DefaultPluginManager.create({ bot }),
    };
  };
}
