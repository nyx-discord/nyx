# Mounting (https://nyx-discord.github.io/nyx/guide/use/http/mounting)

Discord sends requests to two URLs, which you set on the Developer Portal:

- The **Interactions Endpoint URL**, handled by the client itself.
- The **Webhook Events URL**, handled by `client.getWebhookEventHandler()`. It's optional, see [Webhook events](/use/http/webhook-events).

Both are handlers with one method, `handle()`, which takes a request and returns the response to send. The package also includes two adapters for the most common signatures:

| Adapter          | Signature                                                                        | Use it with                                       |
|------------------|----------------------------------------------------------------------------------|---------------------------------------------------|
| `toNodeListener` | `(req: IncomingMessage, res: ServerResponse) => Promise<void>`                    | `node:http`, Express                              |
| `toFetchHandler` | `(request: Request, context?: { waitUntil?(promise): void }) => Promise<Response>` | Hono, Cloudflare Workers, Bun, Deno, Next.js      |

Both answer non-`POST` requests with `405`.

<Callout type="warn">
  Discord's signature is checked against the **raw** request body. Make sure nothing parses the body before the client sees it, like `express.json()` or Fastify's default JSON parser.
</Callout>

## node:http [#nodehttp]

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
// ---cut---
import { createServer } from 'node:http';
import { toNodeListener } from '@nyx-discord/http';

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
```

## Express [#express]

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
import type { RequestListener } from 'node:http';
declare const client: HttpNyxClient;
declare const app: { post(path: string, handler: RequestListener): void };
// ---cut---
import { toNodeListener } from '@nyx-discord/http';

// no express.json() on these routes
app.post('/interactions', toNodeListener(client));
app.post('/webhook-events', toNodeListener(client.getWebhookEventHandler()));
```

## Fastify [#fastify]

Fastify parses JSON by default, so register a parser that keeps the body as a `Buffer`, and call `handle()` directly. Passing Fastify's request as `raw` makes it available to your handlers through [`TypedFields.HttpRequest`](/use/http/requests#reading-the-request):

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
type Request = { body: unknown; headers: Record<string, string | undefined> };
type Reply = { code(status: number): Reply; headers(headers: Record<string, string>): Reply; send(body: string): Reply };
declare const app: {
  addContentTypeParser(type: string, options: { parseAs: 'buffer' }, parser: (req: Request, body: Buffer, done: (error: null, body: Buffer) => void) => void): void;
  post(path: string, handler: (req: Request, reply: Reply) => Promise<Reply>): void;
};
// ---cut---
app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (_req, body, done) => done(null, body));

const endpoints = [
  ['/interactions', client],
  ['/webhook-events', client.getWebhookEventHandler()],
] as const;

for (const [path, handler] of endpoints) {
  app.post(path, async (req, reply) => {
    const result = await handler.handle({
      body: req.body as Buffer,
      signature: req.headers['x-signature-ed25519'],
      timestamp: req.headers['x-signature-timestamp'],
      raw: req,
    });

    return reply.code(result.status).headers(result.headers).send(result.body);
  });
}
```

## Hono [#hono]

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
declare const app: { post(path: string, handler: (c: { req: { raw: Request } }) => Promise<Response>): void };
// ---cut---
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

app.post('/interactions', (c) => interactions(c.req.raw));
app.post('/webhook-events', (c) => webhookEvents(c.req.raw));
```

When Hono runs on Cloudflare Workers, pass `c.executionCtx` as the second argument too, so the worker stays alive until your handlers finish.

## Cloudflare Workers [#cloudflare-workers]

Pass the worker's `ctx` as the handler's second argument, so the worker stays alive until your handlers finish (see [Serverless platforms](/use/http/requests#serverless-platforms)):

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
type ExecutionContext = { waitUntil(promise: Promise<unknown>): void };
// ---cut---
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);
    const handler = pathname === '/webhook-events' ? webhookEvents : interactions;

    return handler(request, ctx);
  },
};
```

## Bun and Deno [#bun-and-deno]

Both accept a default export with a `fetch` handler:

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
// ---cut---
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);
const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

export default {
  fetch(request: Request) {
    const { pathname } = new URL(request.url);
    return pathname === '/webhook-events' ? webhookEvents(request) : interactions(request);
  },
};
```

## Next.js [#nextjs]

Use a route handler for each URL, passing [`after()`](https://nextjs.org/docs/app/api-reference/functions/after) as `waitUntil`, so the function stays alive until your handlers finish:

```ts twoslash title="app/interactions/route.ts"
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
// ---cut---
import { after } from 'next/server';
import { toFetchHandler } from '@nyx-discord/http';

const interactions = toFetchHandler(client);

export const POST = (request: Request) => interactions(request, { waitUntil: after });
```

```ts twoslash title="app/webhook-events/route.ts"
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
// ---cut---
import { after } from 'next/server';
import { toFetchHandler } from '@nyx-discord/http';

const webhookEvents = toFetchHandler(client.getWebhookEventHandler());

export const POST = (request: Request) => webhookEvents(request, { waitUntil: after });
```

## Anything else [#anything-else]

Call `handle()` with the raw body (a `string` or `Uint8Array`) and the two signature headers, then send back what it returns. The webhook event handler works the same way:

```ts twoslash
import type { HttpNyxClient } from '@nyx-discord/http';
declare const client: HttpNyxClient;
declare const rawBody: Uint8Array;
declare const headers: Record<string, string | undefined>;
declare const originalRequest: unknown;
// ---cut---
const result = await client.handle({
  body: rawBody,
  signature: headers['x-signature-ed25519'],
  timestamp: headers['x-signature-timestamp'],
  raw: originalRequest, // optional, for TypedFields.HttpRequest
});

result.status; // the status code
result.headers; // the headers to set
result.body; // the body, empty when there's none
result.handled; // settles once the handlers finish, for waitUntil()
```
