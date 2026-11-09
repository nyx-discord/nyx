# Configuration (https://nyx-discord.github.io/nyx/guide/use/http/configuration)

Every part of the client can be replaced through `clientInjections` (or `injections`, when calling `HttpNyxClient.create()` yourself):

| Injection            | Default                                                    | Description                                                                       |
|----------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `verifier`           | `DefaultSignatureVerifier`                                 | Verifies Discord's Ed25519 signatures.                                            |
| `rest`               | A `REST` with the bot's token                              | The REST client used by `api`.                                                    |
| `api`                | An `API` over `rest`                                       | The API passed to commands and subscribers.                                       |
| `emitter`            | A `BasicAwaitableEventEmitter`                             | The emitter interactions and webhook events are emitted on. Its `emit()` resolves when the listeners finish, which is what `handled` waits for. |
| `acknowledgeTimeout` | `3_000`                                                    | How long to wait for an interaction to be acknowledged, in milliseconds.          |
| `maxTimestampAge`    | `300_000`                                                  | How old (or how far in the future) a request can be before it's rejected, in ms.  |

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
  clientInjections: {
    acknowledgeTimeout: 2_500,
    maxTimestampAge: 60_000,
  },
}));
```

## Signature verification [#signature-verification]

The default verifier checks signatures with the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
(`crypto.subtle`), so it needs no dependencies and works on Node.js, Bun, Deno and Cloudflare Workers.

On runtimes without a global `crypto.subtle`, like older Node.js versions, pass one yourself:

```ts twoslash
declare const env: Record<string, string>;
// ---cut---
import { webcrypto } from 'node:crypto';
import { DefaultSignatureVerifier, HttpBot } from '@nyx-discord/http';

const bot = HttpBot.create(() => ({
  applicationId: env.APP_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.TOKEN,
  logger: console,
  deployCommands: true,
  clientInjections: {
    verifier: DefaultSignatureVerifier.create({
      publicKey: env.DISCORD_PUBLIC_KEY,
      subtle: webcrypto.subtle as SubtleCrypto,
    }),
  },
}));
```

Or implement <DocsLink pkg="http" name="SignatureVerifier" /> to use any other library. For example, with [tweetnacl](https://www.npmjs.com/package/tweetnacl):

```ts twoslash
declare const env: Record<string, string>;
// ---cut---
import nacl from 'tweetnacl';
import { HttpBot, type SignatureVerifier } from '@nyx-discord/http';

class NaclVerifier implements SignatureVerifier {
  protected readonly publicKey: Uint8Array;

  protected readonly encoder = new TextEncoder();

  constructor(publicKey: string) {
    this.publicKey = Buffer.from(publicKey, 'hex');
  }

  public async verify(body: string | Uint8Array, signature: string, timestamp: string) {
    // Discord signs the timestamp followed by the raw body
    const bodyBytes = typeof body === 'string' ? this.encoder.encode(body) : body;
    const message = Buffer.concat([this.encoder.encode(timestamp), bodyBytes]);

    try {
      return nacl.sign.detached.verify(message, Buffer.from(signature, 'hex'), this.publicKey);
    } catch {
      // tweetnacl throws on malformed signatures, which are just invalid requests
      return false;
    }
  }
}

const bot = HttpBot.create(() => ({
  applicationId: env.APP_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.TOKEN,
  logger: console,
  deployCommands: true,
  clientInjections: {
    verifier: new NaclVerifier(env.DISCORD_PUBLIC_KEY),
  },
}));
```
