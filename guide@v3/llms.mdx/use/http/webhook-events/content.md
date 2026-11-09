# Webhook events (https://nyx-discord.github.io/nyx/guide@v3/use/http/webhook-events)

Besides interactions, Discord can send some events about your app over HTTP: [webhook events](https://discord.com/developers/docs/events/webhook-events). For example, when a user authorizes or deauthorizes your app, or when an entitlement is created.

They're sent to a separate URL, the **Webhook Events URL**, which you set on the Developer Portal under **Webhooks**, along with the events you want to receive.

## Mounting [#mounting]

`client.getWebhookEventHandler()` returns a handler for that URL, which works with the same [adapters](/use/http/mounting) as the client:

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
import type { RequestListener } from 'node:http';
declare const client: HttpNyxClient;
declare const app: { post(path: string, handler: RequestListener): void };
// ---cut---
import { toNodeListener } from '@nyx-discord/http';

app.post('/interactions', toNodeListener(client));
app.post('/webhook-events', toNodeListener(client.getWebhookEventHandler()));
```

The handler verifies requests like the client does, and answers every event (and Discord's `PING`) with a `204`.

## Subscribing [#subscribing]

Each event is emitted on the client's emitter under its type, one of the [`ApplicationWebhookEventType`](https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationWebhookEventType) values. An `HttpBot`'s client event bus accepts them, so write an `AbstractWebhookEventSubscriber` and subscribe it like any other client subscriber:

```ts twoslash
import type { HttpBot } from '@nyx-discord/http';
declare const bot: HttpBot;
// ---cut---
import type { APIWebhookEventApplicationAuthorizedData } from '@discordjs/core';
import { ApplicationWebhookEventType } from '@discordjs/core';
import { AbstractWebhookEventSubscriber, type Metadata, type WebhookEventProps } from '@nyx-discord/http';

class AuthorizedSubscriber extends AbstractWebhookEventSubscriber<ApplicationWebhookEventType.ApplicationAuthorized> {
  protected readonly event = ApplicationWebhookEventType.ApplicationAuthorized;

  public handleEvent(
    _meta: Metadata,
    { data, timestamp }: WebhookEventProps<APIWebhookEventApplicationAuthorizedData>,
  ) {
    console.log(`${data.user.username} authorized the app at ${timestamp}`);
    //                     ^?
  }
}

await bot.subscribeToClient(new AuthorizedSubscriber());
```

Since they're client subscribers, the [event loader](/loaders/events) picks them up too, and their metadata has the same fields as other client events, like [`TypedFields.HttpRequest`](/use/http/requests#reading-the-request).

The payload is the usual `{ data, api, shardId }`, where `data` is the event's data (`APIWebhookEvent...Data` from `discord-api-types`), plus the event's `timestamp`. Webhook events aren't realtime and can arrive late or out of order, so use the timestamp when order matters.

<Callout>
  Discord retries an event for up to 10 minutes if your endpoint doesn't answer, and stops sending events if it fails too often. Since the handler answers as soon as the event is emitted, slow subscribers don't delay the response.
</Callout>
