import type {
  BotOptions,
  InjectableBotDependencies,
  NyxBot,
} from '@nyx-discord/types';
import { TypedFields } from '@nyx-discord/types';
import {
  BasicEventEmitterBus,
  BaseBot,
  DefaultBotService,
  DefaultMetadataFactory,
  DefaultPluginManager,
  DefaultScheduleManager,
} from '@nyx-discord/base';
import type { ApplicationCommand, Client, ClientEvents } from 'discord.js';
import type { DjsNyxClient } from '../client/DjsNyxClient.js';
import { DefaultCommandManager } from '../features/command/DefaultCommandManager.js';
import type { DjsInteractionTypes } from '../types/DjsInteractionTypes.js';

type DjsBotDependencies = InjectableBotDependencies<
  DjsInteractionTypes,
  DjsNyxClient,
  ClientEvents,
  ApplicationCommand
>;

type DjsBotOptionsWithDefaults<
  Implementations extends Partial<DjsBotDependencies>,
> = Implementations
  & Pick<
    BotOptions<DjsBotDependencies>,
    'logger' | 'client' | 'token' | 'deployCommands'
  >;

/** The discord.js Bot. */
export class DjsBot<
  Implementations extends DjsBotDependencies = DjsBotDependencies,
> extends BaseBot<Implementations> {
  public static create<Implementations extends Partial<DjsBotDependencies>>(
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
      };
    });
  }

  public static readonly DefaultOptionsGenerator = (
    bot: NyxBot,
    client: DjsNyxClient,
  ) => {
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      bot,
    ]);
    const clientBus = BasicEventEmitterBus.createSyncWithEmitter<
      ClientEvents,
      Client
    >(client.getEmitter(), metaFactory);

    return {
      clientEventBus: clientBus,
      commandManager: DefaultCommandManager.create({
        bot,
        client: client.getEmitter(),
        clientBus,
      }),
      scheduleManager: DefaultScheduleManager.create({ bot }),
      service: DefaultBotService.create({ bot }),
      pluginManager: DefaultPluginManager.create({ bot }),
    };
  };
}
