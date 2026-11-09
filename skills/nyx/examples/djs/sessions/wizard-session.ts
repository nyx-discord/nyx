// A multi-step wizard: each page is a stage with its own handlers and result, and page buttons move between them.
// Docs: https://nyx-discord.github.io/nyx/guide/session/types/stage-pagination-session.md
import { randomBytes } from 'node:crypto';

import { AbstractStandaloneCommand, TypedFields, type DjsInteractionTypes, type Metadata } from '@nyx-discord/djs';
import {
  AbstractSessionStage,
  AbstractSessionStartStage,
  AbstractStagePaginationSession,
  type DjsSessionStartInteraction,
  type DjsSessionUpdateInteraction,
  type SessionStageArray,
} from '@nyx-discord/plugin-sessions/djs';
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
  type InteractionUpdateOptions,
  type ModalSubmitInteraction,
} from 'discord.js';

type Profile = { name: string | null; color: string | null };

type Components = InteractionUpdateOptions['components'];

// Updates the message the components live on, for any session update interaction.
async function updateMessage(interaction: DjsSessionUpdateInteraction, content: string, components: Components) {
  if ('update' in interaction) await interaction.update({ content, components });
}

// The first stage must be a start stage: onStart() makes the session's first reply.
class NameStage extends AbstractSessionStartStage<string> {
  // A session can start from a command, component or modal interaction.
  public async onStart(interaction: DjsSessionStartInteraction) {
    await interaction.reply({ content: this.render(), components: this.components() });
  }

  // Called when the user comes back to this stage. Return whether to renew the TTL.
  public async onSwitch(interaction: DjsSessionUpdateInteraction) {
    await updateMessage(interaction, this.render(), this.components());
    return true;
  }

  public onLeave() {}

  protected override async handleButton(interaction: ButtonInteraction) {
    const input = new TextInputBuilder().setCustomId('name').setLabel('Name').setStyle(TextInputStyle.Short);
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(this.session.buildCustomId())
        .setTitle('Your name')
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input)),
    );
    return true;
  }

  protected override async handleModal(interaction: ModalSubmitInteraction) {
    this.result = interaction.fields.getTextInputValue('name');
    await updateMessage(interaction, this.render(), this.components());
    return true;
  }

  protected render() {
    return `**Step 1/2:** Name: ${this.result ?? 'not set'}`;
  }

  protected components(): Components {
    // Components handled by the current stage use the session's customId; page buttons come from buildBasicPageRow().
    const setName = new ButtonBuilder()
      .setCustomId(this.session.buildCustomId())
      .setLabel('Set name')
      .setStyle(ButtonStyle.Primary);
    return [new ActionRowBuilder<ButtonBuilder>().addComponents(setName), this.buildBasicPageRow()];
  }
}

class ColorStage extends AbstractSessionStage<string> {
  public async onSwitch(interaction: DjsSessionUpdateInteraction) {
    await updateMessage(interaction, this.render(), this.components());
    return true;
  }

  public onLeave() {}

  protected override async handleSelect(interaction: AnySelectMenuInteraction) {
    this.result = interaction.values[0] ?? null;
    await updateMessage(interaction, this.render(), this.components());
    return true;
  }

  protected render() {
    return `**Step 2/2:** Color: ${this.result ?? 'not set'}`;
  }

  protected components(): Components {
    const select = new StringSelectMenuBuilder()
      .setCustomId(this.session.buildCustomId())
      .setPlaceholder('Pick a color')
      .addOptions(['Red', 'Green', 'Blue'].map((color) => ({ label: color, value: color })));
    return [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select), this.buildBasicPageRow()];
  }
}

export class ProfileWizardSession extends AbstractStagePaginationSession<Profile> {
  protected readonly nameStage = new NameStage(this);

  protected readonly colorStage = new ColorStage(this);

  // Page 0 is the start stage, page 1 the next one, and so on.
  protected readonly stages: SessionStageArray<DjsInteractionTypes> = [this.nameStage, this.colorStage];

  // Collect the stages' results into the session's result before it's handed to the starter.
  public async onEnd() {
    this.result = { name: this.nameStage.getResult(), color: this.colorStage.getResult() };
    await this.startInteraction.editReply({ content: 'Profile saved!', components: [] });
  }
}

export class ProfileCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder().setName('profile').setDescription('Set up your profile').toJSON();

  public async execute(interaction: ChatInputCommandInteraction, meta: Metadata) {
    const session = new ProfileWizardSession({
      bot: TypedFields.Bot.get(meta, true),
      id: randomBytes(6).toString('base64url'),
      startInteraction: interaction,
      ttl: 120_000,
    });
    await session.start();

    const { result } = await session.getEndPromise();
    // Save it with your own storage.
    console.log(result);
  }
}
