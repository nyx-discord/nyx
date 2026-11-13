# Cloudflare Workers (https://nyx-discord.github.io/nyx/guide/use/http/serverless/cloudflare-workers)

This page assumes you've read [Serverless](/use/http/serverless), and have a `createBot()` function like the one there.

<Steps>
<Step>

### Creating the project [#creating-the-project]

```npm
npm create cloudflare@latest my-bot -- --type hello-world --lang ts
```

```npm
npm i @nyx-discord/http @discordjs/core
```

The bot doesn't need the `nodejs_compat` compatibility flag.

</Step>
<Step>

### Writing the worker [#writing-the-worker]

Workers only give you your secrets through `env` once a request arrives, and don't allow network calls before that, so
create the bot on the first request and keep the promise for the next ones. Pass the worker's `ctx` to the handler, so the
worker stays alive until your handlers finish:

```ts twoslash title="src/index.ts"
import type { HttpBot } from '@nyx-discord/http';
type BotEnv = { APP_ID: string; DISCORD_PUBLIC_KEY: string; TOKEN: string };
type ExecutionContext = { waitUntil(promise: Promise<unknown>): void };
declare function createBot(env: BotEnv, deployCommands: boolean): Promise<HttpBot>;
// ---cut---
import { toFetchHandler } from '@nyx-discord/http';

type Handlers = {
  interactions: ReturnType<typeof toFetchHandler>;
  webhookEvents: ReturnType<typeof toFetchHandler>;
};

let handlers: Promise<Handlers> | null = null;

function getHandlers(env: BotEnv) {
  handlers ??= createBot(env, false).then((bot) => {
    const client = bot.getClient();
    return {
      interactions: toFetchHandler(client),
      webhookEvents: toFetchHandler(client.getWebhookEventHandler()),
    };
  });
  return handlers;
}

export default {
  async fetch(request: Request, env: BotEnv, ctx: ExecutionContext) {
    const { interactions, webhookEvents } = await getHandlers(env);
    const { pathname } = new URL(request.url);
    const handler = pathname === '/webhook-events' ? webhookEvents : interactions;

    return handler(request, ctx);
  },
};
```

</Step>
<Step>

### Running locally [#running-locally]

Put your secrets in `.dev.vars`:

```bash
APP_ID=...
DISCORD_PUBLIC_KEY=...
TOKEN=...
```

```npm
npx wrangler dev
```

This runs the worker in `workerd`, the same runtime as production. Test it [without Discord](/use/http/serverless#testing-without-discord),
or expose it with a tunnel (like `cloudflared tunnel --url http://localhost:8787`) and set the tunnel's URL as your app's
Interactions Endpoint URL.

</Step>
<Step>

### Deploying [#deploying]

Put your secrets in a file kept out of git (it can be the same as `.dev.vars`), and pass it on the first deploy:

```npm
npx wrangler deploy --secrets-file .dev.vars
```

Later deploys keep the secrets, so `npx wrangler deploy` is enough. Remember to [deploy your commands](/use/http/serverless#deploying-commands) too.

<Callout>
  If it's your account's first worker, the deploy also creates your `workers.dev` subdomain, whose certificate can take a few
  minutes. Until then, requests to it fail with a TLS handshake error.
</Callout>

</Step>
<Step>

### Setting the endpoint [#setting-the-endpoint]

On the Developer Portal, set your app's **Interactions Endpoint URL** to `https://<worker>.<subdomain>.workers.dev/interactions`,
and its Webhook Events URL (if you use them) to `.../webhook-events`.

</Step>
</Steps>
