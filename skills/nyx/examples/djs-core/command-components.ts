// Command components with @discordjs/core.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/components.md
import {
  ButtonStyle,
  ComponentType,
  type APIActionRowComponent,
  type APIButtonComponent,
  type APIChatInputApplicationCommandInteraction,
  type APIMessageComponentButtonInteraction,
  type ToEventProps,
} from '@discordjs/core';
import { AbstractStandaloneCommand, TypedFields, type Metadata } from '@nyx-discord/djs-core';

export class CounterCommand extends AbstractStandaloneCommand {
  protected readonly data = { name: 'counter', description: 'A click counter' };

  public async execute(interaction: ToEventProps<APIChatInputApplicationCommandInteraction>, meta: Metadata) {
    await interaction.api.interactions.reply(interaction.data.id, interaction.data.token, {
      content: 'Count: 0',
      components: [this.buildRow(meta, 0)],
    });
  }

  // Also available: handleSelectMenu() and handleModal(). They're protected.
  protected override async handleButton(
    interaction: ToEventProps<APIMessageComponentButtonInteraction>,
    meta: Metadata,
  ) {
    const count = Number(TypedFields.CustomIdExtra.get(meta, true)) + 1;
    await interaction.api.interactions.updateMessage(interaction.data.id, interaction.data.token, {
      content: `Count: ${count}`,
      components: [this.buildRow(meta, count)],
    });
  }

  protected buildRow(meta: Metadata, count: number): APIActionRowComponent<APIButtonComponent> {
    const bot = TypedFields.Bot.get(meta, true);
    return {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: '+1',
          custom_id: this.buildCustomId(bot, String(count)),
        },
      ],
    };
  }
}
