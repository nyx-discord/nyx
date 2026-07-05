![nyx/framework Logo](assets/nyx_framework.png)

---

`@nyx-discord/plugin-sessions` is a stateful interaction handler for Discord bots within the nyx framework.

It helps you transform one-shot commands and components into rich, long-lived conversation flows with users
(buttons, select menus, modals, and multi-step workflows), all with automatic TTL-based expiration.

- **Paginated lists**: server settings, moderation logs, shop inventories, with any kind of interaction in between.
- **Multi-step wizards**: ticket creation flows, onboarding guides, configuration setups, each step as a `SessionStage`.
- **Interactive menus**: any message where the user can press buttons, pick from dropdowns, or fill in modals to drive behavior.
- **Rich result flows**: let users build something interactively, then `await session.getEndPromise()` to receive the final result and continue your command logic.

## 💻 Full example

```ts
import { AbstractSession } from '@nyx-discord/plugin-sessions';
import { TypedFields, type Metadata } from '@nyx-discord/framework';
import {
  StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
  ButtonBuilder, ButtonStyle, ActionRowBuilder,
} from 'discord.js';
import type { ButtonInteraction, AnySelectMenuInteraction } from 'discord.js';

class CounterSession extends AbstractSession<number> {
  protected override readonly ttl = 30_000;
  protected override result = 0;
  private step = 1;

  public async onStart() {
    const selectId = this.buildCustomId('step');
    const incId = this.buildCustomId('inc');
    const decId = this.buildCustomId('dec');

    const select = new StringSelectMenuBuilder()
      .setCustomId(selectId)
      .setPlaceholder('Step size: 1')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('Step: 1').setValue('1'),
        new StringSelectMenuOptionBuilder().setLabel('Step: 5').setValue('5'),
        new StringSelectMenuOptionBuilder().setLabel('Step: 10').setValue('10'),
      );

    const inc = new ButtonBuilder().setCustomId(incId).setLabel('+').setStyle(ButtonStyle.Success);
    const dec = new ButtonBuilder().setCustomId(decId).setLabel('-').setStyle(ButtonStyle.Danger);

    await this.startInteraction.reply({
      content: `Count: ${this.result}`,
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select),
        new ActionRowBuilder<ButtonBuilder>().addComponents(inc, dec),
      ],
    });
  }

  protected async handleButton(interaction: ButtonInteraction, meta: Metadata) {
    const extra = TypedFields.CustomIdExtra.get(meta, true);
    if (extra === 'inc') this.result += this.step;
    else if (extra === 'dec') this.result -= this.step;

    await interaction.update({ content: `Count: ${this.result}` });
    return true;
  }

  protected async handleSelectMenu(interaction: AnySelectMenuInteraction) {
    this.step = Number(interaction.values[0]);
    await interaction.update(`Count: ${this.result} (+${this.step})`);
    return true;
  }

  public async onEnd() {
    await this.startInteraction.editReply({
      content: `Final count: ${this.result}`,
      components: [],
    });
  }
}
```

Start it from a command and get the final count:

```ts
import { nanoid } from 'nanoid'; // Or the short ID generator of your preference

// Inside a command handler:
const session = new CounterSession({ bot, id: nanoid(), startInteraction: interaction });
await session.start();

const endData = await session.getEndPromise();
console.log(endData.result); // the final count, typed as number
```

## 📖 Documentation

- [Guide (Docusaurus)](https://nyx-discord.github.io/nyx/docs/session) — getting started, session types, filters, middlewares, events
- [Typedoc](https://nyx-discord.github.io/nyx/typedoc) — full API reference for classes, types, and interfaces
