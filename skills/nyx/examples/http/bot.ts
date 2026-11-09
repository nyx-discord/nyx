// Entry point of a bot that receives interactions (Interactions Endpoint URL) and webhook events (Webhook Events URL) over HTTP instead of the gateway.
// Everything else is written like @discordjs/core: reuse ../djs-core, importing from @nyx-discord/http.
// Docs: https://nyx-discord.github.io/nyx/guide/use/http.md
import { createServer } from 'node:http';
import type { APIWebhookEventApplicationAuthorizedData } from '@discordjs/core';
import { ApplicationWebhookEventType } from '@discordjs/core';
import {
  AbstractWebhookEventSubscriber,
  HttpBot,
  toNodeListener,
  TypedFields,
  type Metadata,
  type WebhookEventProps,
} from '@nyx-discord/http';

import { PingCommand } from '../djs-core/standalone-command.js';

// Webhook events (Webhook Events URL) are subscribed like client events, on the same bus.
class AuthorizedSubscriber extends AbstractWebhookEventSubscriber<ApplicationWebhookEventType.ApplicationAuthorized> {
  protected readonly event = ApplicationWebhookEventType.ApplicationAuthorized;

  public handleEvent(meta: Metadata, { data, timestamp }: WebhookEventProps<APIWebhookEventApplicationAuthorizedData>) {
    // The HTTP request the event came from; `raw` is the server's original request (here, an IncomingMessage).
    const request = TypedFields.HttpRequest.get(meta);
    console.log(`${data.user.username} authorized the app at ${timestamp}`, request?.signature);
  }
}

const token = process.env['DISCORD_TOKEN'];
const applicationId = process.env['DISCORD_APPLICATION_ID'];
const publicKey = process.env['DISCORD_PUBLIC_KEY'];
if (!token || !applicationId || !publicKey) {
  throw new Error('DISCORD_TOKEN, DISCORD_APPLICATION_ID and DISCORD_PUBLIC_KEY must be set');
}

// No client to create: HttpBot creates it from the application's ID and public key. `Bot` from this package is HttpBot.
const bot = HttpBot.create(() => ({
  applicationId,
  publicKey,
  token,
  logger: console,
  deployCommands: true,
}));

await bot.getCommandManager().addCommands(new PingCommand());
await bot.subscribeToClient(new AuthorizedSubscriber());
await bot.start(); // requests are answered with 503 until this finishes

// nyx ships no server: mount the two handlers on yours. Fetch runtimes (Workers, Bun, Deno, Next.js) use toFetchHandler,
// passing their waitUntil (Workers' ctx, Next's `{ waitUntil: after }`) so work after the response isn't cut off.
const client = bot.getClient();
const interactions = toNodeListener(client);
const webhookEvents = toNodeListener(client.getWebhookEventHandler());

createServer((req, res) => {
  const listener =
    req.url === '/interactions' ? interactions
    : req.url === '/webhook-events' ? webhookEvents
    : null;
  if (!listener) return void res.writeHead(404).end();

  listener(req, res).catch(console.error);
}).listen(3000);
