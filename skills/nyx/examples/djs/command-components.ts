// Buttons, select menus and modals sent by a command, handled in that same command.
// Use this for simple components that come from a command; otherwise use an interactionCreate subscriber.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/components.md
import { AbstractStandaloneCommand, TypedFields, type Metadata } from '@nyx-discord/djs';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
} from 'discord.js';

export class CounterCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('counter').setDescription('A click counter').toJSON();

  public async execute(interaction: ChatInputCommandInteraction, meta: Metadata) {
    await interaction.reply({ content: 'Count: 0', components: [this.buildRow(meta, 0)] });
  }

  // Called when a button whose customId was built by this command is clicked.
  // Also available: handleSelectMenu() and handleModal(). They're protected.
  protected override async handleButton(interaction: ButtonInteraction, meta: Metadata) {
    // The extra string passed to buildCustomId() comes back here, already decoded.
    const count = Number(TypedFields.CustomIdExtra.get(meta, true)) + 1;
    await interaction.update({ content: `Count: ${count}`, components: [this.buildRow(meta, count)] });
  }

  protected buildRow(meta: Metadata, count: number) {
    const bot = TypedFields.Bot.get(meta, true);
    // The bot's codec builds the customId, so always build it with the bot that'll receive the click.
    // The extra data is a short string; use @sapphire/string-store to pack objects into it.
    const button = new ButtonBuilder()
      .setCustomId(this.buildCustomId(bot, String(count)))
      .setLabel('+1')
      .setStyle(ButtonStyle.Primary);
    return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  }
}
