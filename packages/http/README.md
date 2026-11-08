# @nyx-discord/http

Receive Discord interactions and webhook events over HTTP instead of the gateway, with any server or runtime.

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

createServer(toNodeListener(client)).listen(3000);
```

## Express

```ts
import { toNodeListener } from '@nyx-discord/http';

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

app.post('/interactions', async (req, reply) => {
  const result = await client.handle({
    body: req.body as Buffer,
    signature: req.headers['x-signature-ed25519'] as string | undefined,
    timestamp: req.headers['x-signature-timestamp'] as string | undefined,
  });
  return reply.code(result.status).headers(result.headers).send(result.body);
});
```

## Hono

```ts
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
app.post('/interactions', (c) => interactions(c.req.raw));
```

## Cloudflare Workers / Bun / Deno

```ts
import { toFetchHandler } from '@nyx-discord/http';

export default { fetch: toFetchHandler(client) };
```

## Next.js (route handler)

```ts
import { toFetchHandler } from '@nyx-discord/http';

export const POST = toFetchHandler(client);
```
