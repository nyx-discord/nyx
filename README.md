![nyx Logo](assets/nyx.png)

---

A Discord bot framework that stays out of your way.

[![CI](https://img.shields.io/github/actions/workflow/status/nyx-discord/nyx/ci.yml?style=for-the-badge&label=CI)](https://github.com/nyx-discord/nyx/actions/workflows/ci.yml)
[![Built with Typescript](https://img.shields.io/badge/Built%20with-Typescript-3176C6?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Discord Invite](https://img.shields.io/badge/Visit%20us%20in-Discord-5662f6?style=for-the-badge&logo=discord&logoColor=5662f6)](https://discord.gg/PQZmwaBZd5)

nyx handles application commands, components, events, schedules and plugins on top of
[discord.js](https://discord.js.org) or [@discordjs/core](https://discord.js.org/docs/packages/core/main), through the
gateway or [over HTTP](https://nyx-discord.github.io/nyx/guide/use/http) with `@nyx-discord/http`. It's built to be the
Discord layer of your app, not your whole app.

## ✨ Why nyx

- **Everything is replaceable.** Every part (command manager, resolver, deployer, event dispatcher, error handler...) is
  an interface with a default implementation. To change how something works, plug in your own, with no forking, or
  monkey-patching.
- **It doesn't take over your app.** nyx doesn't own your process, storage, logging or error reporting. Your services
  keep the business logic, making your code testable and maintainable.
- **Same API on discord.js and @discordjs/core.** Pick the library you want; filters, middlewares, events, schedules
  and plugins work the same on both.
- **Gateway or HTTP.** With `@nyx-discord/http` you can make a bot receive interactions and webhook events over
  HTTP, mounted on any server or runtime (node:http, Express, Fastify, Hono, Workers, Bun, Deno, Next.js), with no
  gateway connection.
- **Commands that handle their own components.** Buttons, select menus and modals sent by a command come back to that
  command, with extra data encoded in the customId for you.
- **Type-safe events and metadata.** Event buses are typed by their events, and metadata is read and written through
  typed fields.
- **No global state.** Run several bots in one process, and reuse the same command instances across them.
- **Docs for humans and agents.** A guide with typechecked examples, and an agent skill so AI tools write correct nyx code.

## 🚀 Quick example

```bash
npm i @nyx-discord/djs discord.js
```

```ts
import { AbstractStandaloneCommand, Bot } from '@nyx-discord/djs';
import { Client, GatewayIntentBits, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

class PingCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('ping').setDescription('Pong!').toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  }
}

const bot = Bot.create(() => ({
  token: process.env['DISCORD_TOKEN']!,
  client: new Client({ intents: [GatewayIntentBits.Guilds] }),
  logger: console,
  deployCommands: true,
}));

await bot.getCommandManager().addCommands(new PingCommand());
await bot.start();
```

## 📖 Documentation

- [Guide](https://nyx-discord.github.io/nyx/guide): how to use nyx, and how to replace its internals.
- [API reference](https://nyx-discord.github.io/nyx/docs): every class, interface and type.

## 🤖 Using an AI agent

- **Agent skill:** `npx skills add nyx-discord/nyx` installs [the nyx skill](skills/nyx/SKILL.md) into Claude Code,
  Cursor, Codex and others. It covers nyx's conventions and typechecked examples for both adapters.
- **llms.txt:** point your agent at [`llms.txt`](https://nyx-discord.github.io/nyx/guide/llms.txt), an index of every
  guide page, or at [`llms-full.txt`](https://nyx-discord.github.io/nyx/guide/llms-full.txt) for all of it in one file.
- **Markdown pages:** add `.md` to any guide URL, e.g.
  [`/use/commands.md`](https://nyx-discord.github.io/nyx/guide/use/commands.md).
