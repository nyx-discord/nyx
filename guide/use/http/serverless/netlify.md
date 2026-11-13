# Netlify (https://nyx-discord.github.io/nyx/guide/use/http/serverless/netlify)

This page assumes you've read [Serverless](/use/http/serverless), and have a `createBot()` function like the one there.

<Steps>
<Step>

### Installing [#installing]

In your project, install the bot and Netlify's types:

```npm
npm i @nyx-discord/http @discordjs/core
```

```npm
npm i -D @netlify/functions
```

</Step>
<Step>

### Writing the function [#writing-the-function]

Functions go in `netlify/functions/`, and `config.path` sets the URLs they're served at. Your secrets are in `process.env`
when the module loads, so the bot can be created right away. Netlify's `context` has a `waitUntil`, so pass it as is to keep
the function alive until your handlers finish:

```ts twoslash title="netlify/functions/discord.mts"
// @filename: shims.d.ts
declare module '@netlify/functions' {
  export type Context = { waitUntil(promise: Promise<unknown>): void };
  export type Config = { path: string[] };
}
// @filename: index.ts
import type { HttpBot } from '@nyx-discord/http';
type BotEnv = { APP_ID: string; DISCORD_PUBLIC_KEY: string; TOKEN: string };
declare function createBot(env: BotEnv, deployCommands: boolean): Promise<HttpBot>;
// ---cut---
import { toFetchHandler } from '@nyx-discord/http';
import type { Config, Context } from '@netlify/functions';

const handlers = createBot(process.env as BotEnv, false).then((bot) => {
  const client = bot.getClient();
  return {
    interactions: toFetchHandler(client),
    webhookEvents: toFetchHandler(client.getWebhookEventHandler()),
  };
});

export default async (request: Request, context: Context) => {
  const { interactions, webhookEvents } = await handlers;
  const { pathname } = new URL(request.url);
  const handler = pathname === '/webhook-events' ? webhookEvents : interactions;

  return handler(request, context);
};

export const config: Config = {
  path: ['/interactions', '/webhook-events'],
};
```

</Step>
<Step>

### Running locally [#running-locally]

Put your secrets in `.env`:

```bash
APP_ID=...
DISCORD_PUBLIC_KEY=...
TOKEN=...
```

```npm
npx netlify dev
```

Test it [without Discord](/use/http/serverless#testing-without-discord) at `http://localhost:8888/interactions`, or
expose it with `npx netlify dev --live` and set that URL as your app's Interactions Endpoint URL.

</Step>
<Step>

### Deploying [#deploying]

Add your secrets to the site, from your `.env` file:

```npm
npx netlify env:import .env
```

```npm
npx netlify deploy --prod
```

Remember to [deploy your commands](/use/http/serverless#deploying-commands) too.

</Step>
<Step>

### Setting the endpoint [#setting-the-endpoint]

On the Developer Portal, set your app's **Interactions Endpoint URL** to `https://<site>.netlify.app/interactions`,
and its Webhook Events URL (if you use them) to `https://<site>.netlify.app/webhook-events`.

</Step>
</Steps>
