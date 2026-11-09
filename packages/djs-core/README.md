![@nyx-discord/djs-core](https://raw.githubusercontent.com/nyx-discord/nyx/main/packages/djs-core/assets/nyx_djs-core.png)

---

`@nyx-discord/djs-core` is the [@discordjs/core](https://discord.js.org/docs/packages/core/main) adapter for
[nyx](https://github.com/nyx-discord/nyx), a Discord bot framework that stays out of your way. It handles application
commands, components, events, schedules and plugins on top of a lightweight `@discordjs/core` client, with no cache.

It re-exports everything from `@nyx-discord/base`, so it's the only nyx package you need to install.

## 📥 Installing

```bash
npm i @nyx-discord/djs-core @discordjs/core @discordjs/rest @discordjs/ws
```

## 🚀 Quick example

```ts
import { Client, GatewayIntentBits, type APIChatInputApplicationCommandInteraction, type ToEventProps } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { AbstractStandaloneCommand, Bot, CoreNyxClient } from '@nyx-discord/djs-core';

class PingCommand extends AbstractStandaloneCommand {
  protected readonly data = { name: 'ping', description: 'Pong!' };

  public async execute(interaction: ToEventProps<APIChatInputApplicationCommandInteraction>) {
    await interaction.api.interactions.reply(interaction.data.id, interaction.data.token, { content: 'Pong!' });
  }
}

const token = process.env['DISCORD_TOKEN']!;
const rest = new REST({ version: '10' }).setToken(token);
const gateway = new WebSocketManager({ token, intents: GatewayIntentBits.Guilds, rest });
const client = new Client({ rest, gateway });

const bot = Bot.create(() => ({
  token,
  // the client is wrapped in a CoreNyxClient, together with the gateway and your application ID
  client: new CoreNyxClient(client, gateway, process.env['DISCORD_APPLICATION_ID']!),
  logger: console,
  deployCommands: true,
}));

await bot.getCommandManager().addCommands(new PingCommand());
await bot.start();
```

To receive interactions over HTTP instead of the gateway, use
[`@nyx-discord/http`](https://www.npmjs.com/package/@nyx-discord/http), which builds on this package.

## 🧩 Related packages

- [`@nyx-discord/http`](https://www.npmjs.com/package/@nyx-discord/http): receive interactions and webhook events over
  HTTP, on any server or runtime.
- [`@nyx-discord/loaders`](https://www.npmjs.com/package/@nyx-discord/loaders): load commands, events and schedules
  from directories.
- [`@nyx-discord/plugin-sessions`](https://www.npmjs.com/package/@nyx-discord/plugin-sessions): long-lived interactive
  flows (pagination, wizards, menus).
- [`@nyx-discord/typed-options`](https://www.npmjs.com/package/@nyx-discord/typed-options): slash command options typed
  from the command data.

## 📖 Documentation

- [Guide](https://nyx-discord.github.io/nyx/guide/use/first-start): getting started, commands, events, schedules and
  plugins.
- [Guide as Markdown for AI agents](https://nyx-discord.github.io/nyx/guide/llms.txt), or install the agent skill with
  `npx skills add nyx-discord/nyx`.
- [API reference](https://nyx-discord.github.io/nyx/docs): every class, interface and type.
