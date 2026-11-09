![@nyx-discord/http](https://raw.githubusercontent.com/nyx-discord/nyx/main/packages/http/assets/nyx_http.png)

---

`@nyx-discord/http` lets your [nyx](https://github.com/nyx-discord/nyx) bot receive Discord interactions and webhook events over HTTP instead of the gateway, with any server or runtime.
See the [guide's HTTP section](https://nyx-discord.github.io/nyx/guide/use/http) for everything else.

```ts
import { HttpBot } from '@nyx-discord/http';

const bot = HttpBot.create(() => ({
  applicationId: env.APP_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.TOKEN,
  logger: console,
  deployCommands: false,
}));
await bot.start();

const client = bot.getClient();
```

Point the Interactions Endpoint URL at `client`, and the Webhook Events URL (optional) at
`client.getWebhookEventHandler()`.

## node:http

```ts
import { createServer } from 'node:http';
import { toNodeListener } from '@nyx-discord/http';

const interactions = toNodeListener(client);
const webhookEvents = toNodeListener(client.getWebhookEventHandler());

createServer((req, res) => {
  const listener =
    req.url === '/interactions'
      ? interactions
      : req.url === '/webhook-events'
        ? webhookEvents
        : null;
  if (!listener) return void res.writeHead(404).end();

  listener(req, res).catch(console.error);
}).listen(3000);
```

## Express

```ts
import { toNodeListener } from '@nyx-discord/http';

// no express.json() on these routes: the signature is checked against the raw body
app.post('/interactions', toNodeListener(client));
app.post('/webhook-events', toNodeListener(client.getWebhookEventHandler()));
```

## Fastify

```ts
app.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  (_req, body, done) => done(null, body),
);

for (const [path, handler] of [
  ['/interactions', client],
  ['/webhook-events', client.getWebhookEventHandler()],
] as const) {
  app.post(path, async (req, reply) => {
    const result = await handler.handle({
      body: req.body as Buffer,
      signature: req.headers['x-signature-ed25519'] as string | undefined,
      timestamp: req.headers['x-signature-timestamp'] as string | undefined,
      raw: req,
    });
    return reply.code(result.status).headers(result.headers).send(result.body);
  });
}
```

## Hono

```ts
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

app.post('/interactions', (c) => interactions(c.req.raw));
app.post('/webhook-events', (c) => webhookEvents(c.req.raw));
```

## Cloudflare Workers

```ts
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

export default {
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const handler =
      pathname === '/webhook-events' ? webhookEvents : interactions;

    // passing ctx keeps the worker alive until your handlers finish
    return handler(request, ctx);
  },
};
```

## Bun / Deno

```ts
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

export default {
  fetch(request: Request) {
    const { pathname } = new URL(request.url);
    return pathname === '/webhook-events'
      ? webhookEvents(request)
      : interactions(request);
  },
};
```

## Next.js (route handlers)

```ts
// app/interactions/route.ts
import { after } from 'next/server';
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);

export const POST = (request: Request) =>
  interactions(request, { waitUntil: after });
```

```ts
// app/webhook-events/route.ts
import { after } from 'next/server';
import { toFetchHandler } from '@nyx-discord/http';

const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

export const POST = (request: Request) =>
  webhookEvents(request, { waitUntil: after });
```

## 📖 Documentation

- [Guide](https://nyx-discord.github.io/nyx/guide/use/http): configuration, mounting, requests and webhook events.
- [Guide as Markdown for AI agents](https://nyx-discord.github.io/nyx/guide/use/http.md), or install the agent skill with
  `npx skills add nyx-discord/nyx`.
- [API reference](https://nyx-discord.github.io/nyx/docs): every class, interface and type.
