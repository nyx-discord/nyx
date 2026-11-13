# HTTP Overview (https://nyx-discord.github.io/nyx/guide/use/http)

The [`@nyx-discord/http`](https://www.npmjs.com/package/@nyx-discord/http) package lets an `@discordjs/core` bot receive [interactions](https://discord.com/developers/docs/interactions/overview)
and [webhook events](https://discord.com/developers/docs/events/webhook-events) over HTTP, instead of through a gateway connection.

Discord sends each interaction as a `POST` request to your app's Interactions Endpoint URL, so a bot that only handles
commands and components doesn't need a long-lived connection at all. It can run on a regular server, or on serverless
platforms like Cloudflare Workers or Vercel.

The framework doesn't ship a server and never opens a port. Our client takes a request and returns a response, and you pass
requests to it from the server you already use: `node:http`, Express, Fastify, Hono, Next.js, Bun, Deno, Workers...

## Installation [#installation]

<Steps>
<Step>

### Installing [#installing]

```npm
npm i @nyx-discord/http @discordjs/core
```

The package re-exports `@nyx-discord/djs-core`, so commands, events, schedules and everything else are imported from `@nyx-discord/http`. Everything in this guide that applies to `@discordjs/core` applies here too.

</Step>
<Step>

### Creating the bot [#creating-the-bot]

`HttpBot.create()` works like `@nyx-discord/djs-core`'s `Bot.create()`, but takes your application's ID and public key (both on the [Developer Portal](https://discord.com/developers/applications)) instead of a client, and creates the client for you. `Bot` from `@nyx-discord/http` is `HttpBot`, so examples using `Bot.create()` or the `Bot` type work as-is:

```ts twoslash
declare const env: Record<string, string>;
// ---cut---
import { HttpBot } from '@nyx-discord/http';

const bot = HttpBot.create(() => ({
  applicationId: env.APP_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.TOKEN,
  logger: console,
  deployCommands: true,
}));

await bot.start();

const client = bot.getClient();
//    ^?
```

Requests are answered with `503` until `bot.start()` finishes, so nothing reaches your commands before they're registered.

</Step>
<Step>

### Mounting the client [#mounting-the-client]

Pass incoming requests to the client from your server. See [Mounting](/use/http/mounting) for each backend:

```ts twoslash
import { HttpBot } from '@nyx-discord/http';
declare const bot: HttpBot;
// ---cut---
import { createServer } from 'node:http';
import { toNodeListener } from '@nyx-discord/http';

createServer(toNodeListener(bot.getClient())).listen(3000);
```

</Step>
<Step>

### Setting the endpoint [#setting-the-endpoint]

On the Developer Portal, set your app's **Interactions Endpoint URL** to the public URL of that route. Discord sends a `PING` to check it, which the client answers by itself.

</Step>
</Steps>

## What's different from the gateway [#whats-different-from-the-gateway]

- Only interactions (`InteractionCreate`) and [webhook events](/use/http/webhook-events) are emitted. Subscribers to any other gateway event (messages, members, guilds...) never fire.
- Commands work unchanged: they reply through `api.interactions.reply()` and friends, as they do on the gateway. See [Handling requests](/use/http/requests).
- Schedules run while the process is alive. On serverless platforms, triggering them (e.g. with Workers cron triggers) is up to you, see [Serverless](/use/http/serverless).
- Only the `@discordjs/core` adapter is supported, since discord.js structures need a gateway-backed `Client`.

## Getting the bot [#getting-the-bot]

Inside commands, subscribers and schedules, `TypedFields.HttpBot` gets the bot from the metadata, typed so its client is the `HttpNyxClient`:

```ts twoslash
import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/http';

class CleanupSchedule extends AbstractSchedule {
  protected readonly interval = '0 * * * *';

  public async tick(meta: Metadata) {
    const bot = TypedFields.HttpBot.get(meta, true);
    const client = bot.getClient();
    //    ^?
  }
}
```

`@nyx-discord/http` exports its own `TypedFields`, without `@nyx-discord/djs-core`'s `GatewayCoreBot`, since HTTP bots have no gateway client.
