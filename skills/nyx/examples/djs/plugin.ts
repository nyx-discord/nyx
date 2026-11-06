// A plugin packs commands, subscribers and schedules so they can be added to any bot.
// Write plugins against @nyx-discord/base interfaces when they should work with both adapters.
// Docs: https://nyx-discord.github.io/nyx/guide/use/plugins.md
import { AbstractStandaloneCommand, type NyxBot, type NyxPlugin } from '@nyx-discord/djs';
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

class StatusCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('status').setDescription('Bot status').toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Uptime: ${Math.round(process.uptime())}s`);
  }
}

export class StatusPlugin implements NyxPlugin {
  // A unique id, so the plugin can be found with bot.getPluginManager().
  public static readonly Id = Symbol('status-plugin');

  protected readonly command = new StatusCommand();

  public async onRegister(bot: NyxBot) {
    await bot.getCommandManager().addCommands(this.command);
  }

  public async onUnregister(bot: NyxBot) {
    await bot.getCommandManager().removeCommands(this.command);
  }

  // Informational only, nyx doesn't use it.
  public getData() {
    return { name: 'status-plugin', version: '1.0.0', description: 'Adds a /status command' };
  }

  public getId() {
    return StatusPlugin.Id;
  }
}
