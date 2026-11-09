import type { APIRequest } from '@discordjs/rest';
import { REST, RESTEvents } from '@discordjs/rest';
import {
  ApplicationWebhookEventType,
  ApplicationWebhookType,
  GatewayDispatchEvents,
  InteractionResponseType,
  InteractionType,
  Routes,
} from '@discordjs/core/http-only';
import { describe, expect, test, vi } from 'vitest';
import type { SignatureVerifier } from '../../../src';
import { HttpNyxClient } from '../../../src';
import { MockSigner } from '../mocks/MockSigner';

const CommandInteraction = {
  id: '1',
  token: 'interaction-token',
  type: InteractionType.ApplicationCommand,
  application_id: '123',
};

function createClient(options?: {
  verifier?: SignatureVerifier;
  acknowledgeTimeout?: number;
}) {
  const rest = new REST();
  const client = HttpNyxClient.create({
    applicationId: '123',
    publicKey: '00',
    token: 'token',
    injections: {
      rest,
      verifier: options?.verifier ?? { verify: () => Promise.resolve(true) },
      acknowledgeTimeout: options?.acknowledgeTimeout ?? 1_000,
    },
  });
  return { client, rest };
}

function request(body: unknown) {
  return {
    body: JSON.stringify(body),
    signature: 'aa',
    timestamp: MockSigner.now(),
  };
}

// simulates handlers that are still running, so only the callback or the timeout can end the wait
function keepHandling(client: HttpNyxClient) {
  client
    .getEmitter()
    .on(GatewayDispatchEvents.InteractionCreate, () => new Promise(() => {}));
}

function callbackRequest(id: string, token: string): APIRequest {
  return {
    method: 'POST',
    path: Routes.interactionCallback(id, token),
  } as APIRequest;
}

describe('HttpNyxClient (handle)', () => {
  test('GIVEN a client not logged in WHEN handling THEN returns 503', async () => {
    const { client } = createClient();

    const result = await client.handle(request({ type: InteractionType.Ping }));

    expect(result.status).toBe(503);
  });

  test('GIVEN missing signature headers WHEN handling THEN returns 401', async () => {
    const { client } = createClient();
    await client.login();

    const result = await client.handle({
      body: '{}',
      signature: null,
      timestamp: undefined,
    });

    expect(result.status).toBe(401);
  });

  test('GIVEN a stale timestamp WHEN handling THEN returns 401 without verifying', async () => {
    const verify = vi.fn(() => Promise.resolve(true));
    const { client } = createClient({ verifier: { verify } });
    await client.login();

    const result = await client.handle({
      ...request({ type: InteractionType.Ping }),
      timestamp: String(Math.floor(Date.now() / 1_000) - 10 * 60),
    });

    expect(result.status).toBe(401);
    expect(verify).not.toHaveBeenCalled();
  });

  test('GIVEN a signature the verifier rejects WHEN handling THEN returns 401', async () => {
    const { client } = createClient({
      verifier: { verify: () => Promise.resolve(false) },
    });
    await client.login();

    const result = await client.handle(request({ type: InteractionType.Ping }));

    expect(result.status).toBe(401);
  });

  test('GIVEN a body that is not JSON WHEN handling THEN returns 400', async () => {
    const { client } = createClient();
    await client.login();

    const result = await client.handle({ ...request({}), body: '{' });

    expect(result.status).toBe(400);
  });

  test('GIVEN a real signed PING WHEN handling THEN answers PONG', async () => {
    const signer = await MockSigner.create();
    const client = HttpNyxClient.create({
      applicationId: '123',
      publicKey: signer.publicKey,
      token: 'token',
    });
    await client.login();

    const result = await client.handle(
      await signer.signRequest(JSON.stringify({ type: InteractionType.Ping })),
    );

    expect(result.status).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      type: InteractionResponseType.Pong,
    });
  });

  test('GIVEN an interaction WHEN handling THEN emits InteractionCreate with core event props', async () => {
    const { client, rest } = createClient();
    await client.login();
    const listener = vi.fn(() => {
      rest.emit(
        RESTEvents.Response,
        callbackRequest(CommandInteraction.id, CommandInteraction.token),
        {} as never,
      );
    });
    client.getEmitter().on(GatewayDispatchEvents.InteractionCreate, listener);

    const result = await client.handle(request(CommandInteraction));

    expect(result).toMatchObject({ status: 202, headers: {}, body: '' });
    expect(listener).toHaveBeenCalledWith({
      data: CommandInteraction,
      api: client.getApi(),
      shardId: -1,
    });
  });

  test('GIVEN an interaction WHEN the callback is posted later THEN resolves only after it', async () => {
    const { client, rest } = createClient({ acknowledgeTimeout: 10_000 });
    await client.login();
    keepHandling(client);

    let settled = false;
    const handling = client.handle(request(CommandInteraction)).then((r) => {
      settled = true;
      return r;
    });

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(settled).toBe(false);

    // a request to another route doesn't count as the acknowledge
    rest.emit(
      RESTEvents.Response,
      callbackRequest('2', 'other-token'),
      {} as never,
    );
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(settled).toBe(false);

    rest.emit(
      RESTEvents.Response,
      callbackRequest(CommandInteraction.id, CommandInteraction.token),
      {} as never,
    );

    await expect(handling).resolves.toMatchObject({ status: 202 });
  });

  test('GIVEN an interaction nobody acknowledges WHEN the timeout passes THEN returns 202', async () => {
    vi.useFakeTimers();
    try {
      const { client } = createClient({ acknowledgeTimeout: 3_000 });
      await client.login();
      keepHandling(client);

      const handling = client.handle(request(CommandInteraction));
      await vi.advanceTimersByTimeAsync(3_000);

      await expect(handling).resolves.toMatchObject({ status: 202 });
    } finally {
      vi.useRealTimers();
    }
  });

  test('GIVEN a pending interaction WHEN destroying THEN releases it', async () => {
    const { client } = createClient({ acknowledgeTimeout: 10_000 });
    await client.login();
    keepHandling(client);

    const handling = client.handle(request(CommandInteraction));
    await new Promise((resolve) => setTimeout(resolve, 20));
    await client.destroy();

    await expect(handling).resolves.toMatchObject({ status: 202 });
  });
});

describe('HttpNyxClient (handled)', () => {
  test('GIVEN handlers that finish without acknowledging WHEN handling THEN returns without waiting for the timeout', async () => {
    vi.useFakeTimers();
    try {
      const { client } = createClient({ acknowledgeTimeout: 10_000 });
      await client.login();
      client
        .getEmitter()
        .on(GatewayDispatchEvents.InteractionCreate, () => Promise.resolve());

      const handling = client.handle(request(CommandInteraction));
      await vi.advanceTimersByTimeAsync(0);

      await expect(handling).resolves.toMatchObject({ status: 202 });
    } finally {
      vi.useRealTimers();
    }
  });

  test('GIVEN a handler that keeps working after acknowledging WHEN handling THEN handled settles after it', async () => {
    const { client, rest } = createClient();
    await client.login();
    let finishWork!: () => void;
    client.getEmitter().on(GatewayDispatchEvents.InteractionCreate, () => {
      rest.emit(
        RESTEvents.Response,
        callbackRequest(CommandInteraction.id, CommandInteraction.token),
        {} as never,
      );
      return new Promise<void>((resolve) => {
        finishWork = resolve;
      });
    });

    const result = await client.handle(request(CommandInteraction));

    let handled = false;
    void result.handled.then(() => {
      handled = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(handled).toBe(false);

    finishWork();
    await expect(result.handled).resolves.toBeUndefined();
  });

  test('GIVEN a webhook event subscriber still working WHEN handling THEN answers 204 before handled settles', async () => {
    const { client } = createClient();
    await client.login();
    let finishWork!: () => void;
    client.getEmitter().on(
      ApplicationWebhookEventType.ApplicationAuthorized,
      () =>
        new Promise<void>((resolve) => {
          finishWork = resolve;
        }),
    );

    const result = await client.handleWebhookEvent(
      request({
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

    expect(result.status).toBe(204);
    let handled = false;
    void result.handled.then(() => {
      handled = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(handled).toBe(false);

    finishWork();
    await expect(result.handled).resolves.toBeUndefined();
  });

  test('GIVEN a rejected request WHEN handling THEN handled is already settled', async () => {
    const { client } = createClient();

    const result = await client.handle(request(CommandInteraction));

    expect(result.status).toBe(503);
    await expect(result.handled).resolves.toBeUndefined();
  });
});

describe('HttpNyxClient (handleWebhookEvent)', () => {
  const AuthorizedEvent = {
    version: 1,
    application_id: '123',
    type: ApplicationWebhookType.Event,
    event: {
      type: ApplicationWebhookEventType.ApplicationAuthorized,
      timestamp: '2026-11-08T00:00:00.000Z',
      data: { user: { id: '7' }, scopes: ['applications.commands'] },
    },
  };

  test('GIVEN a client not logged in WHEN handling THEN returns 503', async () => {
    const { client } = createClient();

    const result = await client.handleWebhookEvent(request(AuthorizedEvent));

    expect(result.status).toBe(503);
  });

  test('GIVEN a signature the verifier rejects WHEN handling THEN returns 401', async () => {
    const { client } = createClient({
      verifier: { verify: () => Promise.resolve(false) },
    });
    await client.login();

    const result = await client.handleWebhookEvent(request(AuthorizedEvent));

    expect(result.status).toBe(401);
  });

  test('GIVEN a PING WHEN handling THEN returns 204 without emitting', async () => {
    const { client } = createClient();
    await client.login();
    const emit = vi.spyOn(client.getEmitter(), 'emit');

    const result = await client.handleWebhookEvent(
      request({
        version: 1,
        application_id: '123',
        type: ApplicationWebhookType.Ping,
      }),
    );

    expect(result).toMatchObject({ status: 204, headers: {}, body: '' });
    expect(emit).not.toHaveBeenCalled();
  });

  test('GIVEN an event WHEN handling THEN emits it under its type with core event props and its timestamp', async () => {
    const { client } = createClient();
    await client.login();
    const listener = vi.fn();
    client
      .getEmitter()
      .on(ApplicationWebhookEventType.ApplicationAuthorized, listener);

    const result = await client
      .getWebhookEventHandler()
      .handle(request(AuthorizedEvent));

    expect(result.status).toBe(204);
    expect(listener).toHaveBeenCalledWith({
      data: AuthorizedEvent.event.data,
      api: client.getApi(),
      shardId: -1,
      timestamp: AuthorizedEvent.event.timestamp,
    });
  });

  test('GIVEN an event body without an event WHEN handling THEN returns 400', async () => {
    const { client } = createClient();
    await client.login();

    const result = await client.handleWebhookEvent(
      request({ ...AuthorizedEvent, event: undefined }),
    );

    expect(result.status).toBe(400);
  });
});
