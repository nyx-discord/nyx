import type {
  API,
  APIInteraction,
  APIWebhookEvent,
  APIWebhookEventBody,
} from '@discordjs/core';
import {
  API as HttpOnlyAPI,
  ApplicationWebhookType,
  GatewayDispatchEvents,
  InteractionResponseType,
  InteractionType,
  Routes,
} from '@discordjs/core/http-only';
import type { APIRequest } from '@discordjs/rest';
import { REST, RESTEvents } from '@discordjs/rest';
import type { CoreClient } from '@nyx-discord/djs-core';
import type { AwaitableEventEmitter } from '../emitter/AwaitableEventEmitter.js';
import { BasicAwaitableEventEmitter } from '../emitter/BasicAwaitableEventEmitter.js';
import type { HttpEndpointHandler } from '../endpoint/HttpEndpointHandler.js';
import type { HttpEndpointRequest } from '../endpoint/HttpEndpointRequest.js';
import type { HttpEndpointResult } from '../endpoint/HttpEndpointResult.js';
import { DefaultSignatureVerifier } from '../verify/DefaultSignatureVerifier.js';
import type { SignatureVerifier } from '../verify/SignatureVerifier.js';
import type { HttpClientEvents } from './HttpClientEvents.js';
import type { WebhookEventProps } from '../webhook/WebhookEventProps.js';

type HttpNyxClientOptions = {
  emitter: AwaitableEventEmitter<HttpClientEvents>;
  rest: REST;
  api: API;
  applicationId: string;
  verifier: SignatureVerifier;
  /** How long to wait for a command to acknowledge an interaction before answering Discord's request, in milliseconds. */
  acknowledgeTimeout: number;
  /** How old (or how far in the future) a request timestamp can be before it's rejected as a replay, in milliseconds. */
  maxTimestampAge: number;
};

/** A {@link CoreClient} that receives interactions and webhook events over HTTP instead of the gateway, emitting them on its emitter. */
export class HttpNyxClient
  implements
    CoreClient<AwaitableEventEmitter<HttpClientEvents>>,
    HttpEndpointHandler
{
  protected readonly emitter: AwaitableEventEmitter<HttpClientEvents>;

  protected readonly rest: REST;

  protected readonly api: API;

  protected readonly applicationId: string;

  protected readonly verifier: SignatureVerifier;

  protected readonly acknowledgeTimeout: number;

  protected readonly maxTimestampAge: number;

  /** Interactions waiting to be acknowledged, keyed by their callback route. */
  protected readonly pending = new Map<string, () => void>();

  protected readonly decoder = new TextDecoder();

  protected readonly webhookEventHandler: HttpEndpointHandler = {
    handle: (request) => this.handleWebhookEvent(request),
  };

  protected loggedIn = false;

  /** The request whose interaction or webhook event is being emitted, set only while its listeners are being called. */
  protected currentRequest: HttpEndpointRequest | null = null;

  constructor(options: HttpNyxClientOptions) {
    this.emitter = options.emitter;
    this.rest = options.rest;
    this.api = options.api;
    this.applicationId = options.applicationId;
    this.verifier = options.verifier;
    this.acknowledgeTimeout = options.acknowledgeTimeout;
    this.maxTimestampAge = options.maxTimestampAge;
  }

  public static create(options: {
    applicationId: string;
    publicKey: string;
    token: string;
    injections?: Partial<Omit<HttpNyxClientOptions, 'applicationId'>>;
  }): HttpNyxClient {
    const injections = options.injections ?? {};
    const rest =
      injections.rest ?? new REST({ version: '10' }).setToken(options.token);

    return new this({
      emitter:
        injections.emitter
        ?? new BasicAwaitableEventEmitter<HttpClientEvents>(),
      rest,
      // same class as @discordjs/core's API, from the entry point that doesn't load @discordjs/ws
      api: injections.api ?? (new HttpOnlyAPI(rest) as unknown as API),
      applicationId: options.applicationId,
      verifier:
        injections.verifier
        ?? DefaultSignatureVerifier.create({ publicKey: options.publicKey }),
      acknowledgeTimeout: injections.acknowledgeTimeout ?? 3_000,
      maxTimestampAge: injections.maxTimestampAge ?? 5 * 60_000,
    });
  }

  public login(): Promise<void> {
    if (!this.loggedIn) {
      this.rest.on(RESTEvents.Response, this.onRestResponse);
      this.loggedIn = true;
    }
    return Promise.resolve();
  }

  public destroy(): Promise<void> {
    this.rest.off(RESTEvents.Response, this.onRestResponse);
    this.loggedIn = false;
    for (const acknowledge of this.pending.values()) {
      acknowledge();
    }
    this.pending.clear();
    return Promise.resolve();
  }

  /** Verifies the request, answers `PING`, and otherwise emits the interaction, returning a `202` once it's acknowledged, its handlers finish, or the acknowledge timeout passes. */
  public async handle(
    request: HttpEndpointRequest,
  ): Promise<HttpEndpointResult> {
    const rejection = await this.checkRequest(request);
    if (rejection) {
      return rejection;
    }

    const interaction = this.parseBody<APIInteraction>(request.body);
    if (!interaction) {
      return this.textResult(400, 'Invalid JSON body.');
    }

    if (interaction.type === InteractionType.Ping) {
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: InteractionResponseType.Pong }),
        handled: Promise.resolve(),
      };
    }

    const { handled } = await this.emitAndWaitForAcknowledge(
      interaction,
      request,
    );
    return { status: 202, headers: {}, body: '', handled };
  }

  /** Verifies the request, answers `PING`, and otherwise emits the webhook event under its type, returning a `204`. */
  public async handleWebhookEvent(
    request: HttpEndpointRequest,
  ): Promise<HttpEndpointResult> {
    const rejection = await this.checkRequest(request);
    if (rejection) {
      return rejection;
    }

    const webhookEvent = this.parseBody<APIWebhookEvent>(request.body);
    if (
      !webhookEvent
      || (webhookEvent.type === ApplicationWebhookType.Event
        && !webhookEvent.event)
    ) {
      return this.textResult(400, 'Invalid webhook event body.');
    }

    const handled =
      webhookEvent.type === ApplicationWebhookType.Event
        ? this.emitWebhookEvent(webhookEvent.event, request)
        : Promise.resolve();
    return { status: 204, headers: {}, body: '', handled };
  }

  public getEmitter(): AwaitableEventEmitter<HttpClientEvents> {
    return this.emitter;
  }

  public getApi(): API {
    return this.api;
  }

  public getApplicationId(): string {
    return this.applicationId;
  }

  /** Returns a handler for the Webhook Events URL, to mount with the same adapters as the client. */
  public getWebhookEventHandler(): HttpEndpointHandler {
    return this.webhookEventHandler;
  }

  /** Returns the request whose interaction or webhook event is being emitted, only while its listeners are called synchronously, or `null` otherwise. From handlers, use `TypedFields.HttpRequest` instead. */
  public getCurrentRequest(): HttpEndpointRequest | null {
    return this.currentRequest;
  }

  /** Returns a rejection result if the request can't be accepted, or `null` if it's a valid, signed request. */
  protected async checkRequest(
    request: HttpEndpointRequest,
  ): Promise<HttpEndpointResult | null> {
    if (!this.loggedIn) {
      return this.textResult(503, 'Client is not logged in.');
    }

    const { body, signature, timestamp } = request;
    if (!signature || !timestamp) {
      return this.textResult(401, 'Missing request signature.');
    }

    const timestampMs = Number(timestamp) * 1_000;
    if (
      !Number.isFinite(timestampMs)
      || Math.abs(Date.now() - timestampMs) > this.maxTimestampAge
    ) {
      return this.textResult(401, 'Stale request timestamp.');
    }

    if (!(await this.verifier.verify(body, signature, timestamp))) {
      return this.textResult(401, 'Invalid request signature.');
    }

    return null;
  }

  protected parseBody<Parsed>(body: string | Uint8Array): Parsed | null {
    try {
      const text = typeof body === 'string' ? body : this.decoder.decode(body);
      return JSON.parse(text) as Parsed;
    } catch {
      return null;
    }
  }

  protected async emitAndWaitForAcknowledge(
    interaction: APIInteraction,
    request: HttpEndpointRequest,
  ): Promise<{ handled: Promise<void> }> {
    const route = Routes.interactionCallback(interaction.id, interaction.token);

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const acknowledged = new Promise<void>((resolve) => {
      this.pending.set(route, resolve);
      timeout = setTimeout(resolve, this.acknowledgeTimeout);
    });

    try {
      const handled = this.emitWithRequest(request, () =>
        this.emitter.emit(GatewayDispatchEvents.InteractionCreate, {
          data: interaction,
          api: this.api,
          shardId: -1,
        }),
      );
      // if the handlers finish without acknowledging (e.g. no command matched), there's nothing left to wait for
      await Promise.race([acknowledged, handled]);
      return { handled };
    } finally {
      clearTimeout(timeout);
      this.pending.delete(route);
    }
  }

  protected emitWebhookEvent(
    event: APIWebhookEventBody,
    request: HttpEndpointRequest,
  ): Promise<void> {
    const props: WebhookEventProps<unknown> = {
      data: event.data,
      api: this.api,
      shardId: -1,
      timestamp: event.timestamp,
    };
    // the event type and its data are correlated, which emit() can't see through the union
    const emitter = this.emitter as unknown as AwaitableEventEmitter<
      Record<string, [unknown]>
    >;
    return this.emitWithRequest(request, () => emitter.emit(event.type, props));
  }

  // listeners are called synchronously within emit(), so this is the request for every listener called meanwhile
  protected emitWithRequest(
    request: HttpEndpointRequest,
    emit: () => Promise<void>,
  ): Promise<void> {
    this.currentRequest = request;
    try {
      return emit();
    } finally {
      this.currentRequest = null;
    }
  }

  protected textResult(status: number, body: string): HttpEndpointResult {
    return {
      status,
      headers: { 'Content-Type': 'text/plain' },
      body,
      handled: Promise.resolve(),
    };
  }

  // arrow function to keep `this` when used as a listener
  protected readonly onRestResponse = (request: APIRequest): void => {
    if (request.method.toUpperCase() !== 'POST') return;
    this.pending.get(request.path)?.();
  };
}
