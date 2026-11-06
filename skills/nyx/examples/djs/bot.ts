// Entry point of a discord.js bot using nyx: create, register, start.
// Docs: https://nyx-discord.github.io/nyx/guide/use/first-start.md
import { Bot } from '@nyx-discord/djs';
import { DjsSessionPlugin } from '@nyx-discord/plugin-sessions/djs';
import { Client, GatewayIntentBits } from 'discord.js';

import { ReadyLogger, WelcomeSubscriber, PurchaseLogger, shopBus } from './client-subscriber.js';
import { CounterCommand } from './command-components.js';
import { UserInfoCommand } from './context-menu-command.js';
import { setupErrorHandling } from './error-handling.js';
import { HelloCommand, LoggingMiddleware, PurgeCommand } from './filter-and-middleware.js';
import { ModCommand } from './parent-command.js';
import { StatusPlugin } from './plugin.js';
import { CleanupSchedule, PresenceSchedule } from './schedule.js';
import { SessionCounterCommand } from './sessions/counter-session.js';
import { WarningsCommand } from './sessions/list-pagination-session.js';
import { ProfileCommand } from './sessions/wizard-session.js';
import { EchoCommand, PingCommand } from './standalone-command.js';

const token = process.env['DISCORD_TOKEN'];
if (!token) throw new Error('DISCORD_TOKEN is not set');

// Any discord.js Client works, as long as it isn't logged in yet. nyx logs it in on start().
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Bot.create() fills in every default manager. Pass your own (e.g. `commandManager`) to replace one.
const bot = Bot.create(() => ({
  token,
  client,
  logger: console, // Any NyxLogger-compatible logger.
  deployCommands: true, // Deploys commands on start(). Or call bot.getCommandManager().deploy() yourself.
}));

setupErrorHandling(bot);

// Middlewares run before every command.
bot.getCommandManager().getExecutor().getMiddleware().add(new LoggingMiddleware());

// Register everything BEFORE start(), so commands are deployed in a single batch.
await bot.getCommandManager().addCommands(
  new PingCommand(),
  new EchoCommand(),
  new ModCommand(),
  new UserInfoCommand(),
  new CounterCommand(),
  new PurgeCommand(),
  new HelloCommand(),
  new SessionCounterCommand(),
  new WarningsCommand(),
  new ProfileCommand(),
);
await bot.subscribeToClient(new ReadyLogger(), new WelcomeSubscriber());
await shopBus.subscribe(new PurchaseLogger());
await bot.getScheduleManager().addSchedule(new PresenceSchedule());
await bot.getScheduleManager().addSchedule(new CleanupSchedule());
await bot.getPluginManager().register(new StatusPlugin());
// Optional: @nyx-discord/plugin-sessions, needed by the commands in ./sessions.
await bot.getPluginManager().register(DjsSessionPlugin.create());

// If start() rejects, the bot is Killed and can't be reused: create a new one instead.
await bot.start();

// nyx doesn't own the process: stopping on signals is up to you.
process.once('SIGINT', () => {
  void bot.stop().finally(() => process.exit(0));
});
