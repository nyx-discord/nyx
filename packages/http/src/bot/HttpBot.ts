import type {
  BotOptions,
  CoreBotDependencies,
  EventBus,
  NyxBot,
} from '@nyx-discord/djs-core';
import { CoreBot } from '@nyx-discord/djs-core';
import { HttpNyxClient } from '../client/HttpNyxClient.js';
import { TypedFields } from '../fields/TypedFields.js';
import type { HttpBotEvents } from './HttpBotEvents.js';

type HttpClientCreateOptions = Parameters<typeof HttpNyxClient.create>[0];

type HttpBotImplementations = Partial<
  Omit<CoreBotDependencies, 'client' | 'clientEventBus'>
>;

type HttpBotOptions<Implementations extends HttpBotImplementations> =
  Implementations
    & Pick<
      BotOptions<CoreBotDependencies>,
      'logger' | 'token' | 'deployCommands'
    >
    & Pick<HttpClientCreateOptions, 'applicationId' | 'publicKey'> & {
      /** Replacements for the parts of the {@link HttpNyxClient} the bot creates. */
      clientInjections?: HttpClientCreateOptions['injections'];
    };

// omitting the client first, since intersecting it would keep CoreClient's getEmitter() overload
/** An @discordjs/core bot that receives interactions and webhook events over HTTP, whose client is an {@link HttpNyxClient}. */
export type HttpBot<Implementations extends HttpBotImplementations = {}> =
  NyxBot<
    Omit<CoreBotDependencies, 'client' | 'clientEventBus'>
      & Implementations & {
        client: HttpNyxClient;
        clientEventBus: EventBus<HttpBotEvents>;
      }
  >;

// a value and not a class, since the bots it creates are CoreBots: `instanceof HttpBot` could never be true
/** Utility to create an {@link HttpBot}, creating its {@link HttpNyxClient}. */
export const HttpBot = {
  /** Creates a bot like `Bot.create()` from @nyx-discord/djs-core, but taking the application's ID and public key instead of a client. */
  create<Implementations extends HttpBotImplementations>(
    generator: (bot: NyxBot) => HttpBotOptions<Implementations>,
  ): HttpBot<Implementations> {
    const httpBot = CoreBot.create((bot) => {
      const { applicationId, publicKey, clientInjections, ...options } =
        generator(bot);
      const client = HttpNyxClient.create({
        applicationId,
        publicKey,
        token: options.token,
        injections: clientInjections,
      });

      return { ...options, client };
    });

    // metadata is created synchronously when the bus emits, while the client still knows which request it's emitting
    const client = httpBot.getClient();
    httpBot
      .getClientEventBus()
      .getMetadataFactory()
      .addDefaultField(TypedFields.HttpRequest, () =>
        client.getCurrentRequest(),
      );

    return httpBot;
  },
} as const;
