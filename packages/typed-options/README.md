# @nyx-discord/typed-options

Typed slash command options, inferred from the command data. No codegen, and no dependency on the rest of nyx: it works
with discord.js, `@discordjs/core`, or raw API payloads.

```ts
import { channel, chatInput, integer, string, user } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs'; // or '/djs-core'
import { ChannelType } from 'discord-api-types/v10';

const data = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    target: user({ description: 'Who', required: true }),
    reason: string({ description: 'Why' }),
    mode: string({ description: 'How', required: true, choices: [{ name: 'Soft', value: 'soft' }] }),
    log: channel({ description: 'Log channel', channel_types: [ChannelType.GuildText] }),
  },
});

// `data` is plain API JSON: register it with any library.

const options = typedOptions(data, interaction);
options.getUser('target'); // User (required)
options.getMember('target'); // GuildMember | null (always nullable)
options.getString('reason'); // string | null
options.getString('mode'); // 'soft'
options.getChannel('log'); // text channel | null
options.getString('reasn'); // compile error: no such option
options.getString('target'); // compile error: 'target' is a user option
```

## Entry points

| Entry        | Contents                                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.`          | `chatInput`, `subcommand`, `group`, the option helpers (`string`, `integer`, `user`...) and the `TypedOptions` types                                 |
| `/djs`       | `typedOptions(data, interaction)`: `interaction.options` with narrower types (a type cast, no runtime cost)                                         |
| `/djs-core`  | `typedOptions(data, input)` over the `@discordjs/core` event props or a bare raw interaction payload (also the HTTP transport); reads `resolved` for you |

## Subcommands

Subcommand names are typed as `string`. Type each subcommand's options by passing that subcommand's own data:

```ts
const add = subcommand({ name: 'add', description: 'Add', options: { name: string({ description: 'Name', required: true }) } });
const tag = chatInput({ name: 'tag', description: 'Tags', subcommands: [add] });

typedOptions(add, interaction).getString('name'); // string
```
