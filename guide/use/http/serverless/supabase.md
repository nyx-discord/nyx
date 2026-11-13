# Supabase Edge Functions (https://nyx-discord.github.io/nyx/guide/use/http/serverless/supabase)

This page assumes you've read [Serverless](/use/http/serverless), and have a `createBot()` function like the one there.
Edge Functions run on Deno, so packages are imported with `npm:` specifiers.

<Steps>
<Step>

### Creating the function [#creating-the-function]

In a project set up with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```npm
npx supabase functions new discord
```

Discord doesn't send Supabase's authorization header, so turn off JWT verification for the function in `supabase/config.toml`:

```toml
[functions.discord]
verify_jwt = false
```

</Step>
<Step>

### Writing the function [#writing-the-function]

Your secrets are in `Deno.env` when the module loads, so the bot can be created right away. Pass `EdgeRuntime.waitUntil`,
so the function stays alive until your handlers finish. Keep the `edge-runtime.d.ts` import the CLI generated, which types it:

```ts twoslash title="supabase/functions/discord/index.ts"
// @noErrors
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { toFetchHandler } from 'npm:@nyx-discord/http';
import { createBot } from './bot.ts';

const handlers = createBot(
  {
    APP_ID: Deno.env.get('APP_ID')!,
    DISCORD_PUBLIC_KEY: Deno.env.get('DISCORD_PUBLIC_KEY')!,
    TOKEN: Deno.env.get('TOKEN')!,
  },
  false,
).then((bot) => {
  const client = bot.getClient();
  return {
    interactions: toFetchHandler(client),
    webhookEvents: toFetchHandler(client.getWebhookEventHandler()),
  };
});

Deno.serve(async (request) => {
  const { interactions, webhookEvents } = await handlers;
  const { pathname } = new URL(request.url);
  const handler = pathname.endsWith('/webhook-events') ? webhookEvents : interactions;

  return handler(request, { waitUntil: (promise) => EdgeRuntime.waitUntil(promise) });
});
```

Import `HttpBot` in your `bot.ts` from `npm:@nyx-discord/http` as well.

</Step>
<Step>

### Running locally [#running-locally]

Put your secrets in `supabase/functions/.env`:

```bash
APP_ID=...
DISCORD_PUBLIC_KEY=...
TOKEN=...
```

```npm
npx supabase functions serve
```

This needs Docker running. Test it [without Discord](/use/http/serverless#testing-without-discord) at
`http://localhost:54321/functions/v1/discord`.

</Step>
<Step>

### Deploying [#deploying]

```npm
npx supabase secrets set --env-file supabase/functions/.env
```

```npm
npx supabase functions deploy discord
```

Remember to [deploy your commands](/use/http/serverless#deploying-commands) too, from Node or with `deno run`.

</Step>
<Step>

### Setting the endpoint [#setting-the-endpoint]

On the Developer Portal, set your app's **Interactions Endpoint URL** to `https://<project-ref>.supabase.co/functions/v1/discord`,
and its Webhook Events URL (if you use them) to `.../functions/v1/discord/webhook-events`.

</Step>
</Steps>
