// A session: a stateful conversation with a user across several interactions, which ends after a TTL of inactivity.
// Requires @nyx-discord/plugin-sessions, registered once per bot:
//   await bot.getPluginManager().register(DjsSessionPlugin.create());
// Docs: https://nyx-discord.github.io/nyx/guide/session.md
//       https://nyx-discord.github.io/nyx/guide/session/types/session.md
import { randomBytes } from 'node:crypto';

import { AbstractStandaloneCommand, TypedFields, type Metadata } from '@nyx-discord/djs';
import { AbstractSession } from '@nyx-discord/plugin-sessions/djs';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  type AnySelectMenuInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';

// The type argument is the session's result, which whoever started it receives when it ends.
export class CounterSession extends AbstractSession<number> {
  protected override readonly ttl = 60_000; // Ends after 1 minute without (accepted) interactions.

  protected override result = 0;

  protected step = 1;

  // Must make the first reply. If it throws, the session isn't started and onEnd() isn't called.
  public async onStart() {
    await this.startInteraction.reply({ content: this.render(), components: this.buildRows() });
  }

  // Runs when the TTL expires, before the result is handed to whoever awaits the session.
  public async onEnd() {
    await this.startInteraction.editReply({ content: `Final count: ${this.result}`, components: [] });
  }

  // Handlers return whether to renew the TTL. Return false to ignore an interaction, e.g. from another user.
  protected override async handleButton(interaction: ButtonInteraction, meta: Metadata) {
    if (interaction.user.id !== this.startInteraction.user.id) {
      await interaction.reply({ content: 'This counter isn\'t yours.', ephemeral: true });
      return false;
    }

    const action = TypedFields.CustomIdExtra.get(meta, true);
    if (action === 'set') {
      // Modals also need a session customId, so the submit is routed back here.
      const input = new TextInputBuilder()
        .setCustomId('value')
        .setLabel('New value')
        .setStyle(TextInputStyle.Short);
      const modal = new ModalBuilder()
        .setCustomId(this.buildCustomId('set'))
        .setTitle('Set the counter')
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
      await interaction.showModal(modal);
      return true;
    }

    this.result += action === 'inc' ? this.step : -this.step;
    await interaction.update({ content: this.render(), components: this.buildRows() });
    return true;
  }

  protected override async handleSelectMenu(interaction: AnySelectMenuInteraction) {
    this.step = Number(interaction.values[0] ?? 1);
    await interaction.update({ content: this.render(), components: this.buildRows() });
    return true;
  }

  protected override async handleModal(interaction: ModalSubmitInteraction) {
    const value = Number(interaction.fields.getTextInputValue('value'));
    if (Number.isNaN(value)) {
      await interaction.reply({ content: 'That isn\'t a number.', ephemeral: true });
      return false;
    }

    this.result = value;
    if (interaction.isFromMessage()) {
      await interaction.update({ content: this.render(), components: this.buildRows() });
    }
    return true;
  }

  protected render() {
    return `Count: ${this.result} (step ${this.step})`;
  }

  protected buildRows() {
    // Every component of a session needs this.buildCustomId(extra?), so the plugin can route it here.
    // The extra comes back in TypedFields.CustomIdExtra.
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(this.buildCustomId('dec')).setLabel('-').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(this.buildCustomId('inc')).setLabel('+').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(this.buildCustomId('set')).setLabel('Set...').setStyle(ButtonStyle.Secondary),
    );
    const select = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(this.buildCustomId('step'))
        .setPlaceholder('Step size')
        .addOptions(['1', '5', '10'].map((value) => ({ label: `Step ${value}`, value }))),
    );
    return [buttons, select];
  }
}

export class SessionCounterCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('session-counter').setDescription('Start a counter session').toJSON();

  public async execute(interaction: ChatInputCommandInteraction, meta: Metadata) {
    const session = new CounterSession({
      bot: TypedFields.Bot.get(meta, true),
      // Short and random, unique among *active* sessions (it's embedded in every customId). nanoid works too.
      id: randomBytes(6).toString('base64url'),
      startInteraction: interaction,
    });
    await session.start();

    // Optional: wait for the session to end and use its result.
    const { result } = await session.getEndPromise();
    await interaction.followUp({ content: `You ended at ${result}.`, ephemeral: true });
  }
}
