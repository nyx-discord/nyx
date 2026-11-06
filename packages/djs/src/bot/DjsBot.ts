import type {
  BotOptions,
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
import type { ApplicationCommand, Client, ClientEvents } from 'discord.js';
import { DjsNyxClient } from '../client/DjsNyxClient.js';
import { DefaultCommandManager } from '../features/command/DefaultCommandManager.js';
import { TypedFields } from '../fields/TypedFields';
import type { DjsInteractionTypes } from '../types/DjsInteractionTypes.js';

/** Dependencies of a discord.js bot, which type its getters (`getClient()`, `getCommandManager()`...). */
export type DjsBotDependencies = InjectableBotDependencies<
  DjsInteractionTypes,
  DjsNyxClient,
  ClientEvents,
  ApplicationCommand
>;

// Helper type that replaces the DjsBotDependencies['client'] (NyxClient) with a d.js Client
// Used in the .create() method to allow the user to specify a Client directly instead of
// a NyxClient for convenience
type DjsBotDependenciesWithDjsClient = Omit<DjsBotDependencies, 'client'> & {
  client: Client;
};

// Required return type for the generator callback in .create(), partializes most
// options but requires the user to provide required ones (logger, client, etc)
type DjsBotOptionsWithDefaults<
  Implementations extends Partial<DjsBotDependenciesWithDjsClient>,
> = Implementations
  & Pick<
    BotOptions<DjsBotDependenciesWithDjsClient>,
    'logger' | 'client' | 'token' | 'deployCommands'
  >;

/**
 * A {@link NyxBot} typed for discord.js, like the one returned by `Bot.create()`.
 * Use it to type functions and fields that receive a bot, so they keep the discord.js types.
 */
export type DjsNyxBot = NyxBot<DjsBotDependencies>;

/** The discord.js Bot. */
export class DjsBot<
  Implementations extends DjsBotDependencies = DjsBotDependencies,
> extends BaseBot<Implementations> {
  public static create<
    Implementations extends Partial<DjsBotDependenciesWithDjsClient>,
  >(
    generator: (bot: NyxBot) => DjsBotOptionsWithDefaults<Implementations>,
  ): NyxBot<DjsBotDependencies & Implementations> {
    return new this((bot) => {
      const generatedOptions = generator(bot);
      const defaultOptions = DjsBot.DefaultOptionsGenerator(
        bot,
        generatedOptions.client,
      );

      return {
        ...defaultOptions,
        ...generatedOptions,
        client: new DjsNyxClient(generatedOptions.client),
      };
    });
  }

  public static readonly DefaultOptionsGenerator = (
    bot: NyxBot,
    client: Client,
  ) => {
    const metaFactory = DefaultMetadataFactory.createWith(
      [TypedFields.Bot, bot],
      [TypedFields.DjsBot, bot as unknown as DjsBot],
    );
    const clientBus = BasicEventEmitterBus.createSyncWithEmitter<
      ClientEvents,
      Client
    >(client, metaFactory);

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
