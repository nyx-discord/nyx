import type { MappedEvents } from '@discordjs/core';
import type {
  BotOptions,
  EventEmitterLike,
  InjectableBotDependencies,
  NyxBot,
} from '@nyx-discord/base';
import {
  BaseBot,
  BasicEventEmitterBus,
  DefaultBotService,
  DefaultMetadataFactory,
  DefaultPluginManager,
  DefaultScheduleManager,
} from '@nyx-discord/base';
import type { CoreClient } from '../client/CoreClient.js';
import { DefaultCommandManager } from '../features/command/DefaultCommandManager.js';
import { TypedFields } from '../fields/TypedFields';
import type { CoreInteractionTypes } from '../types/CoreInteractionTypes.js';

/** Dependencies of an @discordjs/core bot, which type its getters (`getClient()`, `getCommandManager()`...). */
export type CoreBotDependencies = InjectableBotDependencies<
  CoreInteractionTypes,
  CoreClient,
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

/**
 * A {@link NyxBot} typed for @discordjs/core, like the one returned by `Bot.create()`.
 * Use it to type functions and fields that receive a bot, so they keep the @discordjs/core types.
 */
export type CoreNyxBot = NyxBot<CoreBotDependencies>;

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
    client: CoreClient,
  ) => {
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]);
    const clientBus = BasicEventEmitterBus.createSyncWithEmitter<
      MappedEvents,
      EventEmitterLike
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
