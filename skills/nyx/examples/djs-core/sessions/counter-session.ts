// Sessions with @discordjs/core: import from '@nyx-discord/plugin-sessions/djs-core', register CoreSessionPlugin,
// and use API objects and interaction.api like any other @discordjs/core code.
// Everything else (TTL, results, pagination, stages) works like in ../../djs/sessions.
//   await bot.getPluginManager().register(CoreSessionPlugin.create());
// Docs: https://nyx-discord.github.io/nyx/guide/session.md
import { randomBytes } from 'node:crypto';

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
import { AbstractSession } from '@nyx-discord/plugin-sessions/djs-core';

export class CounterSession extends AbstractSession<number> {
  protected override readonly ttl = 60_000;

  protected override result = 0;

  public async onStart() {
    const { data, api } = this.startInteraction;
    await api.interactions.reply(data.id, data.token, { content: this.render(), components: [this.buildRow()] });
  }

  public async onEnd() {
    const { data, api } = this.startInteraction;
    await api.interactions.editReply(data.application_id, data.token, {
      content: `Final count: ${this.result}`,
      components: [],
    });
  }

  // Return whether to renew the TTL.
  protected override async handleButton(
    interaction: ToEventProps<APIMessageComponentButtonInteraction>,
    meta: Metadata,
  ) {
    this.result += TypedFields.CustomIdExtra.get(meta, true) === 'inc' ? 1 : -1;
    await interaction.api.interactions.updateMessage(interaction.data.id, interaction.data.token, {
      content: this.render(),
      components: [this.buildRow()],
    });
    return true;
  }

  protected render() {
    return `Count: ${this.result}`;
  }

  protected buildRow(): APIActionRowComponent<APIButtonComponent> {
    return {
      type: ComponentType.ActionRow,
      components: [
        { type: ComponentType.Button, style: ButtonStyle.Danger, label: '-', custom_id: this.buildCustomId('dec') },
        { type: ComponentType.Button, style: ButtonStyle.Success, label: '+', custom_id: this.buildCustomId('inc') },
      ],
    };
  }
}

export class SessionCounterCommand extends AbstractStandaloneCommand {
  protected readonly data = { name: 'session-counter', description: 'Start a counter session' };

  public async execute(interaction: ToEventProps<APIChatInputApplicationCommandInteraction>, meta: Metadata) {
    const session = new CounterSession({
      bot: TypedFields.Bot.get(meta, true),
      id: randomBytes(6).toString('base64url'),
      startInteraction: interaction,
    });
    await session.start();
  }
}
