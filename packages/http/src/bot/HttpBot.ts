import type {
  BotOptions,
  CoreBotDependencies,
  NyxBot,
} from '@nyx-discord/djs-core';
import { CoreBot } from '@nyx-discord/djs-core';
import { HttpNyxClient } from '../client/HttpNyxClient.js';

type HttpClientCreateOptions = Parameters<typeof HttpNyxClient.create>[0];

type HttpBotOptions<
  Implementations extends Partial<Omit<CoreBotDependencies, 'client'>>,
> = Implementations
  & Pick<BotOptions<CoreBotDependencies>, 'logger' | 'token' | 'deployCommands'>
  & Pick<HttpClientCreateOptions, 'applicationId' | 'publicKey'> & {
    /** Replacements for the parts of the {@link HttpNyxClient} the bot creates. */
    clientInjections?: HttpClientCreateOptions['injections'];
  };

// omitting the client first, since intersecting it would keep CoreClient's getEmitter() overload
/** An @discordjs/core bot that receives interactions over HTTP, whose client is an {@link HttpNyxClient}. */
export type HttpBot<
  Implementations extends Partial<Omit<CoreBotDependencies, 'client'>> = {},
> = NyxBot<
  Omit<CoreBotDependencies, 'client'>
    & Implementations & { client: HttpNyxClient }
>;

// a value and not a class, since the bots it creates are CoreBots: `instanceof HttpBot` could never be true
/** Utility to create an {@link HttpBot}, creating its {@link HttpNyxClient}. */
export const HttpBot = {
  /** Creates a bot like `Bot.create()` from @nyx-discord/djs-core, but taking the application's ID and public key instead of a client. */
  create<Implementations extends Partial<Omit<CoreBotDependencies, 'client'>>>(
    generator: (bot: NyxBot) => HttpBotOptions<Implementations>,
  ): HttpBot<Implementations> {
    return CoreBot.create((bot) => {
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
  },
} as const;
