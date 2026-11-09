# Subcommands (https://nyx-discord.github.io/nyx/guide@v3/typed-options/subcommands)

A command with subcommands has no options of its own, so `chatInput()` takes a list of `subcommands` instead. Create each one with `subcommand()`, and group them with `group()`:

```ts twoslash
import { chatInput, group, string, subcommand } from '@nyx-discord/typed-options';

const add = subcommand({
  name: 'add',
  description: 'Add a tag',
  options: {
    name: string({ description: 'The tag name', required: true }),
  },
});

const purge = subcommand({ name: 'purge', description: 'Delete every tag' });

const data = chatInput({
  name: 'tag',
  description: 'Manage tags',
  subcommands: [add, group({ name: 'admin', description: 'Admin tools', subcommands: [purge] })],
});
```

## Reading a subcommand's options [#reading-a-subcommands-options]

Subcommand and group names are typed as `string`, so which subcommand ran is not inferred from the interaction. Instead, pass **the subcommand's own data** to `typedOptions()` to type its options:

```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { string, subcommand } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';
declare const interaction: ChatInputCommandInteraction;
// ---cut---
const add = subcommand({
  name: 'add',
  description: 'Add a tag',
  options: {
    name: string({ description: 'The tag name', required: true }),
  },
});

const options = typedOptions(add, interaction);

const name = options.getString('name');
//    ^?
```

This fits nyx's [subcommands](/use/commands/types/parent/subcommand), which already live in their own class: define the subcommand's data there and read the options from it.

With raw payloads, `typedOptions()` finds the options inside the subcommand (and its group) for you.
