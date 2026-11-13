# Vercel (https://nyx-discord.github.io/nyx/guide/use/http/serverless/vercel)

This page assumes you've read [Serverless](/use/http/serverless), and have a `createBot()` function like the one there.
If your bot lives in a Next.js app, use a [route handler](/use/http/mounting#nextjs) instead.

<Steps>
<Step>

### Installing [#installing]

In your project, install the bot and Vercel's helpers:

```npm
npm i @nyx-discord/http @discordjs/core @vercel/functions
```

</Step>
<Step>

### Writing the function [#writing-the-function]

Every file in `api/` is a function, served at its path. Your secrets are in `process.env` when the module loads, so the bot
can be created right away. Pass `waitUntil` from `@vercel/functions`, so the function stays alive until your handlers finish:

```ts twoslash title="api/interactions.ts"
// @filename: shims.d.ts
declare module '@vercel/functions' {
  export function waitUntil(promise: Promise<unknown>): void;
}
// @filename: index.ts
import type { HttpBot } from '@nyx-discord/http';
type BotEnv = { APP_ID: string; DISCORD_PUBLIC_KEY: string; TOKEN: string };
declare function createBot(env: BotEnv, deployCommands: boolean): Promise<HttpBot>;
// ---cut---
import { toFetchHandler } from '@nyx-discord/http';
import { waitUntil } from '@vercel/functions';

const handler = createBot(process.env as BotEnv, false).then((bot) =>
  toFetchHandler(bot.getClient()),
);

export async function POST(request: Request) {
  return (await handler)(request, { waitUntil });
}
```

For [webhook events](/use/http/webhook-events), add an `api/webhook-events.ts` that does the same with `toFetchHandler(bot.getClient().getWebhookEventHandler())`.

</Step>
<Step>

### Running locally [#running-locally]

Put your secrets in `.env.local`:

```bash
APP_ID=...
DISCORD_PUBLIC_KEY=...
TOKEN=...
```

```npm
npx vercel dev
```

Test it [without Discord](/use/http/serverless#testing-without-discord) at `http://localhost:3000/api/interactions`, or
expose it with a tunnel and set the tunnel's URL as your app's Interactions Endpoint URL.

</Step>
<Step>

### Deploying [#deploying]

Add your secrets to the project, for each of `APP_ID`, `DISCORD_PUBLIC_KEY` and `TOKEN`:

```npm
npx vercel env add TOKEN production
```

```npm
npx vercel deploy --prod
```

Remember to [deploy your commands](/use/http/serverless#deploying-commands) too.

</Step>
<Step>

### Setting the endpoint [#setting-the-endpoint]

On the Developer Portal, set your app's **Interactions Endpoint URL** to `https://<project>.vercel.app/api/interactions`,
and its Webhook Events URL (if you use them) to `https://<project>.vercel.app/api/webhook-events`.

</Step>
</Steps>
