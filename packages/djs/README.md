![@nyx-discord/djs](https://raw.githubusercontent.com/nyx-discord/nyx/main/packages/djs/assets/nyx_djs.png)

---

`@nyx-discord/djs` is the [discord.js](https://discord.js.org) adapter for [nyx](https://github.com/nyx-discord/nyx), a
Discord bot framework that stays out of your way. It handles application commands, components, events, schedules and
plugins on top of your discord.js client.

It re-exports everything from `@nyx-discord/base`, so it's the only nyx package you need to install.

## 📥 Installing

```bash
npm i @nyx-discord/djs discord.js
```

## 🚀 Quick example

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

## 🧩 Related packages

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
