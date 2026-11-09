// A top-level slash command with no subcommands (/ping, /echo...).
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/types/standalone.md
import { AbstractStandaloneCommand, TypedFields, type Metadata } from '@nyx-discord/djs';
import {
  SlashCommandBuilder,
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
} from 'discord.js';

export class PingCommand extends AbstractStandaloneCommand {
  // `data` is the raw API JSON: build it with a builder and call toJSON().
  protected readonly data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .toJSON();

  public async execute(interaction: ChatInputCommandInteraction, meta: Metadata) {
    // The meta carries the bot that received the interaction, so one instance works across bots.
    // TypedFields.DjsBot is typed for discord.js; TypedFields.Bot is the adapter-agnostic NyxBot.
    const bot = TypedFields.DjsBot.get(meta, true);
    await interaction.reply(`Pong! (${bot.getClient().getEmitter().ws.ping}ms)`);
  }
}

export class EchoCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Repeats your message')
    .addStringOption((option) =>
      option.setName('message').setDescription('What to repeat').setRequired(true).setAutocomplete(true),
    )
    .toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    const message = interaction.options.getString('message', true);
    await interaction.reply(message);
  }

  // Only needed when an option has setAutocomplete(true).
  public override async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    await interaction.respond(
      ['hello', 'goodbye'].filter((value) => value.startsWith(focused)).map((value) => ({ name: value, value })),
    );
  }

  // Deploy to specific guilds instead of globally. Return null (the default) for global.
  public override getGuilds() {
    return ['123456789012345678'];
  }
}
