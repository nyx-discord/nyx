import type { ToEventProps } from '@discordjs/core';
import type {
  APIChatInputApplicationCommandInteraction,
  APIWebhookEventApplicationAuthorizedData,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from '@discordjs/core/http-only';
import {
  ApplicationCommandType,
  ApplicationWebhookEventType,
  ApplicationWebhookType,
  InteractionType,
} from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';
import { describe, expect, expectTypeOf, test, vi } from 'vitest';
import type {
  EventEmitterLike,
  HttpEndpointRequest,
  HttpClientEvents,
  Metadata,
  WebhookEventProps,
} from '../../../src';
import {
  AbstractStandaloneCommand,
  Bot,
  AbstractWebhookEventSubscriber,
  BasicEventEmitterBus,
  CoreBot,
  HttpBot,
  HttpNyxClient,
  TypedFields,
} from '../../../src';
import { MockSigner } from '../../client/mocks/MockSigner';

class PingCommand extends AbstractStandaloneCommand {
  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: 'ping',
    description: 'Pong!',
    type: ApplicationCommandType.ChatInput,
  };

  public receivedRequest: HttpEndpointRequest | null | undefined;

  public async execute(
    { data, api }: ToEventProps<APIChatInputApplicationCommandInteraction>,
    meta: Metadata,
  ): Promise<void> {
    this.receivedRequest = TypedFields.HttpRequest.get(meta);
    await api.interactions.reply(data.id, data.token, { content: 'Pong!' });
  }
}

class AuthorizedSubscriber extends AbstractWebhookEventSubscriber<ApplicationWebhookEventType.ApplicationAuthorized> {
  protected readonly event = ApplicationWebhookEventType.ApplicationAuthorized;

  public readonly handled = vi.fn();

  public handleEvent(
    meta: Metadata,
    props: WebhookEventProps<APIWebhookEventApplicationAuthorizedData>,
  ): void {
    this.handled(
      props.data.user.id,
      props.timestamp,
      TypedFields.HttpRequest.get(meta),
    );
  }
}

describe('HttpBot', () => {
  test('GIVEN bot options WHEN created THEN builds a CoreBot with an HttpNyxClient', () => {
    const bot = HttpBot.create(() => ({
      applicationId: '123',
      publicKey: '00',
      token: 'token',
      logger: console,
      deployCommands: false,
    }));

    expect(bot).toBeInstanceOf(CoreBot);
    expect(bot.getClient()).toBeInstanceOf(HttpNyxClient);
    expect(bot.getClient().getApplicationId()).toBe('123');
    expectTypeOf(bot.getClient()).toEqualTypeOf<HttpNyxClient>();
  });

  test('GIVEN the package exports WHEN using Bot THEN it is HttpBot, as a value and as the bot type', () => {
    expect(Bot).toBe(HttpBot);

    const bot: Bot = Bot.create(() => ({
      applicationId: '123',
      publicKey: '00',
      token: 'token',
      logger: console,
      deployCommands: false,
    }));

    expectTypeOf(bot).toEqualTypeOf<HttpBot>();
    expectTypeOf(bot.getClient()).toEqualTypeOf<HttpNyxClient>();
    expectTypeOf(TypedFields.HttpBot.get({}, false)).toEqualTypeOf<
      HttpBot | undefined
    >();
  });

  test('GIVEN a started bot WHEN a signed command arrives THEN the command replies through the callback and gets the request in its metadata', async () => {
    const signer = await MockSigner.create();
    const makeRequest = vi.fn((_url: string, _init: unknown) =>
      Promise.resolve(new Response(null, { status: 204 })),
    );
    const rest = new REST({ makeRequest } as never).setToken('token');
    const bot = HttpBot.create(() => ({
      applicationId: '123',
      publicKey: signer.publicKey,
      token: 'token',
      logger: console,
      deployCommands: false,
      clientInjections: { rest, acknowledgeTimeout: 2_000 },
    }));
    const client = bot.getClient();

    const command = new PingCommand();
    await bot.getCommandManager().addCommands(command);
    await bot.start();

    const interaction = {
      id: '42',
      token: 'interaction-token',
      application_id: '123',
      type: InteractionType.ApplicationCommand,
      data: { id: '1', name: 'ping', type: ApplicationCommandType.ChatInput },
    };
    const request = await signer.signRequest(JSON.stringify(interaction));
    const result = await client.handle(request);

    expect(result.status).toBe(202);
    expect(command.receivedRequest).toBe(request);
    expect(makeRequest).toHaveBeenCalledOnce();
    const [url, init] = makeRequest.mock.calls[0]!;
    expect(url).toContain('/interactions/42/interaction-token/callback');
    expect(init).toMatchObject({ method: 'POST' });

    await bot.stop();
  });

  test('GIVEN a started bot WHEN a signed webhook event arrives THEN subscribers on a bus over the client emitter receive it with the request', async () => {
    const signer = await MockSigner.create();
    const bot = HttpBot.create(() => ({
      applicationId: '123',
      publicKey: signer.publicKey,
      token: 'token',
      logger: console,
      deployCommands: false,
    }));
    const client = bot.getClient();
    const webhookBus = BasicEventEmitterBus.createSyncWithEmitter<
      HttpClientEvents,
      EventEmitterLike
    >(client.getEmitter(), bot.getClientEventBus().getMetadataFactory());
    const subscriber = new AuthorizedSubscriber();
    await webhookBus.subscribe(subscriber);
    await bot.start();

    const request = await signer.signRequest(
      JSON.stringify({
        version: 1,
        application_id: '123',
        type: ApplicationWebhookType.Event,
        event: {
          type: ApplicationWebhookEventType.ApplicationAuthorized,
          timestamp: '2026-11-08T00:00:00.000Z',
          data: { user: { id: '7' }, scopes: [] },
        },
      }),
    );
    const result = await client.getWebhookEventHandler().handle(request);

    expect(result.status).toBe(204);
    await result.handled;
    expect(subscriber.handled).toHaveBeenCalledWith(
      '7',
      '2026-11-08T00:00:00.000Z',
      request,
    );

    await bot.stop();
  });
});
