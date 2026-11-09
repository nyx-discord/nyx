// Slash commands with @discordjs/core: `data` is a plain API object, interactions are ToEventProps<API...>,
// and replies go through interaction.api.
// Docs: https://nyx-discord.github.io/nyx/guide/use/commands/types/standalone.md
import {
  ApplicationCommandOptionType,
  MessageFlags,
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteraction,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type ToEventProps,
} from '@discordjs/core';
import { AbstractStandaloneCommand, type Metadata } from '@nyx-discord/djs-core';

export class PingCommand extends AbstractStandaloneCommand {
  // Annotate `data` with the API type: a bare object literal widens `type` and won't typecheck once it has options.
  protected readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [
      { type: ApplicationCommandOptionType.String, name: 'message', description: 'Extra text', required: false },
    ],
  };

  public async execute(interaction: ToEventProps<APIChatInputApplicationCommandInteraction>, _meta: Metadata) {
    const option = interaction.data.data.options?.find(
      (opt): opt is APIApplicationCommandInteractionDataStringOption => opt.name === 'message',
    );

    await interaction.api.interactions.reply(interaction.data.id, interaction.data.token, {
      content: `Pong! ${option?.value ?? ''}`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
