# AWS Lambda (https://nyx-discord.github.io/nyx/guide/use/http/serverless/aws-lambda)

This page assumes you've read [Serverless](/use/http/serverless), and have a `createBot()` function like the one there.

Lambda has no `waitUntil`: it freezes the function as soon as the handler returns. The handler below waits for your
handlers to finish before returning, so Discord gets its HTTP response only after your command is done.

Its reply still reaches Discord in time, since commands reply through the API, but keep commands short, and move slow work
(anything after a defer that takes more than a few seconds) to a queue processed by another function.

<Steps>
<Step>

### Installing [#installing]

```npm
npm i @nyx-discord/http @discordjs/core
```

```npm
npm i -D @types/aws-lambda esbuild
```

</Step>
<Step>

### Writing the handler [#writing-the-handler]

Lambda passes the request as an event instead of a `Request`, so call the client's `handle()` yourself. The body can
arrive base64-encoded, and the signature is checked against its exact bytes, so decode it as a buffer:

```ts twoslash title="src/index.ts"
// @filename: shims.d.ts
declare module 'aws-lambda' {
  export type LambdaFunctionURLEvent = {
    rawPath: string;
    body?: string;
    isBase64Encoded: boolean;
    headers: Record<string, string | undefined>;
  };
  export type LambdaFunctionURLResult = { statusCode: number; headers: Record<string, string>; body: string };
}
// @filename: index.ts
import type { HttpBot } from '@nyx-discord/http';
type BotEnv = { APP_ID: string; DISCORD_PUBLIC_KEY: string; TOKEN: string };
declare function createBot(env: BotEnv, deployCommands: boolean): Promise<HttpBot>;
// ---cut---
import type { LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda';

const client = createBot(process.env as BotEnv, false).then((bot) => bot.getClient());

export async function handler(event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> {
  const handler = event.rawPath === '/webhook-events'
    ? (await client).getWebhookEventHandler()
    : await client;

  const result = await handler.handle({
    body: Buffer.from(event.body ?? '', event.isBase64Encoded ? 'base64' : 'utf8'),
    signature: event.headers['x-signature-ed25519'],
    timestamp: event.headers['x-signature-timestamp'],
    raw: event,
  });

  // Lambda freezes once this returns, so wait for the handlers to finish first
  await result.handled;

  return { statusCode: result.status, headers: result.headers, body: result.body };
}
```

</Step>
<Step>

### Deploying [#deploying]

Deploy the function the way you prefer. Some ways to do it:

- **By hand**: bundle with `npx esbuild src/index.ts --bundle --platform=node --target=node22 --format=esm --outfile=dist/index.mjs`,
  zip `dist/index.mjs`, and upload it on the AWS console. The handler is then `index.handler`.
- **[AWS SAM](https://docs.aws.amazon.com/serverless-application-model/)**: a function with `BuildMethod: esbuild` and a
  `FunctionUrlConfig`, deployed with `sam build && sam deploy`.
- **[AWS CDK](https://docs.aws.amazon.com/cdk/)**: a `NodejsFunction`, which bundles your TypeScript by itself, with `addFunctionUrl()`.
- **Continuous deployment**: run either of the above from your CI, like GitHub Actions with
  [`aws-actions/configure-aws-credentials`](https://github.com/aws-actions/configure-aws-credentials), on every push.
  It's a good place to [deploy your commands](/use/http/serverless#deploying-commands) too.

Remember to [deploy your commands](/use/http/serverless#deploying-commands) whichever way you choose.

</Step>
<Step>

### Setting the endpoint [#setting-the-endpoint]

On the Developer Portal, set your app's **Interactions Endpoint URL** to your function URL, and its Webhook Events URL
(if you use them) to the same URL ending in `/webhook-events`.

</Step>
</Steps>
