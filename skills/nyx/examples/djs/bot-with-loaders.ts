// Alternative entry point: @nyx-discord/loaders scans directories of COMPILED .js/.mjs files and registers them.
// Docs: https://nyx-discord.github.io/nyx/guide/loaders.md
//       https://nyx-discord.github.io/nyx/guide/loaders/commands.md
//
// Command folder rules (filenames don't matter, `data.name` does):
//   dist/commands/ping.js            standalone / parent / context menu, constructed with no arguments
//   dist/commands/mod.js             parent with data.name 'mod'
//   dist/commands/mod/ban.js         subcommand of 'mod', constructed with (parent)
//   dist/commands/mod/settings.js    group with data.name 'settings'
//   dist/commands/mod/settings/x.js  subcommand of the 'settings' group
//   dist/commands/utils/...          any other folder is just organization, scanned as a new root
// Classes must be exported. A class can define `static create(bot)` (children: `static create(bot, parent)`)
// instead of a constructor, to receive the bot.
import { Bot, type DjsInteractionTypes } from '@nyx-discord/djs';
import { CommandLoader, EventLoader, ScheduleLoader } from '@nyx-discord/loaders';
import { Client, GatewayIntentBits } from 'discord.js';

const bot = Bot.create(() => ({
  token: process.env['DISCORD_TOKEN'] ?? '',
  client: new Client({ intents: [GatewayIntentBits.Guilds] }),
  logger: console,
  deployCommands: true,
}));

// Load before start(). Paths are relative to the process' working directory.
await CommandLoader.load<DjsInteractionTypes>({ bot, path: './dist/commands' });
await EventLoader.load({ bot, path: './dist/events' });
await ScheduleLoader.load({ bot, path: './dist/schedules' });

await bot.start();
