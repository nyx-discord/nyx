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

/** Utility to create an @discordjs/core bot that receives interactions over HTTP, creating its {@link HttpNyxClient}. */
export class HttpBot {
  public static create<
    Implementations extends Partial<Omit<CoreBotDependencies, 'client'>>,
  >(
    generator: (bot: NyxBot) => HttpBotOptions<Implementations>,
  ): NyxBot<
    Omit<CoreBotDependencies, 'client'>
      & Implementations & { client: HttpNyxClient }
  > {
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
  }
}
