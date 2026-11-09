# Overview (https://nyx-discord.github.io/nyx/guide/typed-options)

The [`@nyx-discord/typed-options`](https://www.npmjs.com/package/@nyx-discord/typed-options) package types
the options of your slash commands from the command data itself, so a misspelled name, a wrong option kind or
a missing `null` check becomes a compile error.

Without it, `interaction.options.getString('reason')` accepts any name, ignores `required` and `choices`, and returns
`string | null` even for options Discord always sends. With it, the getters are checked against the data you already write.

<Callout>
  It doesn't depend on the rest of nyx: it only needs `discord-api-types`. You can use it in any bot that uses discord.js, `@discordjs/core` or raw API payloads, with or without nyx.
</Callout>

## Installation [#installation]

<Steps>
<Step>

### Installing [#installing]

```npm
npm i @nyx-discord/typed-options
```

It has `discord-api-types` as a peer dependency, and `discord.js` as an optional one for the `/djs` entry point.

</Step>
<Step>

### Defining the command [#defining-the-command]

Create the command data with `chatInput()` and one helper per option kind. The result is plain API JSON, so you register it with any library, or use it as the `data` of a nyx command:

```ts twoslash
import { chatInput, string, user } from '@nyx-discord/typed-options';

const data = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    target: user({ description: 'Who to ban', required: true }),
    reason: string({ description: 'Why' }),
  },
});
```

</Step>
<Step>

### Reading the options [#reading-the-options]

Pass the data and the interaction to `typedOptions()`. The entry point you import it from depends on your library:

<Tabs items={['discord.js', 'Raw API']}>
  <Tab>
```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { chatInput, string, user } from '@nyx-discord/typed-options';
declare const interaction: ChatInputCommandInteraction;

const data = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    target: user({ description: 'Who to ban', required: true }),
    reason: string({ description: 'Why' }),
  },
});
// ---cut---
import { typedOptions } from '@nyx-discord/typed-options/djs';

const options = typedOptions(data, interaction);

const target = options.getUser('target');
//    ^?
const reason = options.getString('reason');
//    ^?
```
  </Tab>
  <Tab>
```ts twoslash
import type { APIChatInputApplicationCommandInteraction } from '@discordjs/core';
import { chatInput, string, user } from '@nyx-discord/typed-options';
declare const interaction: APIChatInputApplicationCommandInteraction;

const data = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    target: user({ description: 'Who to ban', required: true }),
    reason: string({ description: 'Why' }),
  },
});
// ---cut---
import { typedOptions } from '@nyx-discord/typed-options/djs-core';

const options = typedOptions(data, interaction);

const target = options.getUser('target');
//    ^?
const reason = options.getString('reason');
//    ^?
```
  </Tab>
</Tabs>

A mistake in the name, or in the kind of option, doesn't compile:

```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { chatInput, string, user } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';
declare const interaction: ChatInputCommandInteraction;

const data = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    target: user({ description: 'Who to ban', required: true }),
    reason: string({ description: 'Why' }),
  },
});
// ---cut---
const options = typedOptions(data, interaction);

// @errors: 2345
// Error! There is no option named "reasn"
options.getString('reasn');
// Error! "target" is a user option, not a string
options.getString('target');
```

</Step>
</Steps>

## Entry points [#entry-points]

| Entry point                           | Purpose                                                                                                                                                                  |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@nyx-discord/typed-options`          | `chatInput()`, `subcommand()`, `group()`, the option helpers, and the types of the getters. Doesn't depend on any Discord library.                                       |
| `@nyx-discord/typed-options/djs`      | `typedOptions()` for discord.js. It returns `interaction.options` with narrower types, so it costs nothing at runtime.                                                    |
| `@nyx-discord/typed-options/djs-core` | `typedOptions()` for raw API payloads. It takes the `@discordjs/core` event props or a bare interaction payload, so it also covers the HTTP transport and other libraries. |

## Using it in a nyx command [#using-it-in-a-nyx-command]

Read the options from the command's own data:

<Tabs items={['discord.js', 'Raw API']}>
  <Tab>
```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { AbstractStandaloneCommand } from '@nyx-discord/djs';
import { chatInput, string, user } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';

class BanCommand extends AbstractStandaloneCommand {
  protected readonly data = chatInput({
    name: 'ban',
    description: 'Ban a member',
    options: {
      target: user({ description: 'Who to ban', required: true }),
      reason: string({ description: 'Why' }),
    },
  });

  public async execute(interaction: ChatInputCommandInteraction) {
    const options = typedOptions(this.data, interaction);
    await interaction.reply(`Banning ${options.getUser('target').username}`);
  }
}
```
  </Tab>
  <Tab>
```ts twoslash
import type { APIChatInputApplicationCommandInteraction, ToEventProps } from '@discordjs/core';
import { AbstractStandaloneCommand } from '@nyx-discord/djs-core';
import { chatInput, string, user } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs-core';

class BanCommand extends AbstractStandaloneCommand {
  protected readonly data = chatInput({
    name: 'ban',
    description: 'Ban a member',
    options: {
      target: user({ description: 'Who to ban', required: true }),
      reason: string({ description: 'Why' }),
    },
  });

  public async execute(interaction: ToEventProps<APIChatInputApplicationCommandInteraction>) {
    const options = typedOptions(this.data, interaction);
    await interaction.api.interactions.reply(interaction.data.id, interaction.data.token, {
      content: `Banning ${options.getUser('target').username}`,
    });
  }
}
```
  </Tab>
</Tabs>

<Callout>
  Builders like `SlashCommandBuilder` can't carry literal types, so they keep working but aren't typed. Use `chatInput()` for the commands whose options you want checked.
</Callout>
