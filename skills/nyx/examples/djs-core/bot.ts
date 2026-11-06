// Entry point of an @discordjs/core bot using nyx. Only what differs from discord.js is shown here:
// filters, middlewares, buses, schedules, plugins and error handling work like in ../djs.
// Docs: https://nyx-discord.github.io/nyx/guide/use/first-start.md
import { Client, GatewayIntentBits } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { Bot, CoreNyxClient, type CoreNyxBot } from '@nyx-discord/djs-core';
import { CoreSessionPlugin } from '@nyx-discord/plugin-sessions/djs-core';

import { InteractionLogger } from './client-subscriber.js';
import { CounterCommand } from './command-components.js';
import { PresenceSchedule } from './schedule.js';
import { SessionCounterCommand } from './sessions/counter-session.js';
import { PingCommand } from './standalone-command.js';

const token = process.env['DISCORD_TOKEN'];
const applicationId = process.env['DISCORD_APPLICATION_ID'];
if (!token || !applicationId) throw new Error('DISCORD_TOKEN and DISCORD_APPLICATION_ID must be set');

const rest = new REST({ version: '10' }).setToken(token);
const gateway = new WebSocketManager({ token, intents: GatewayIntentBits.Guilds, rest });
const client = new Client({ rest, gateway });

// Unlike discord.js, the client is wrapped in a CoreNyxClient, which also takes the gateway and the application ID.
const bot = Bot.create(() => ({
  token,
  client: new CoreNyxClient(client, gateway, applicationId),
  logger: console,
  deployCommands: true,
}));

// Type bot parameters as CoreNyxBot, not NyxBot, to keep the @discordjs/core types.
async function registerAll(target: CoreNyxBot) {
  await target.getCommandManager().addCommands(new PingCommand(), new CounterCommand(), new SessionCounterCommand());
  await target.getPluginManager().register(CoreSessionPlugin.create());
  await target.subscribeToClient(new InteractionLogger());
  await target.getScheduleManager().addSchedule(new PresenceSchedule());
}

await registerAll(bot);
await bot.start();
