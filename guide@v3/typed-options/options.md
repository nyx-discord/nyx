# Options (https://nyx-discord.github.io/nyx/guide@v3/typed-options/options)

Each option is defined with a helper, under the name it will have in Discord. The helpers take the same fields as the [API](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) (`description`, `required`, `choices`, `min_value`...), and `typedOptions()` gives you one getter per option kind.

| Helper          | Getter                                          | Returns                                |
|-----------------|-------------------------------------------------|----------------------------------------|
| `string()`      | `getString()`                                   | `string`                               |
| `integer()`     | `getInteger()`                                  | `number`                               |
| `number()`      | `getNumber()`                                   | `number`                               |
| `boolean()`     | `getBoolean()`                                  | `boolean`                              |
| `user()`        | `getUser()`, `getMember()`                      | The user, and the member               |
| `channel()`     | `getChannel()`                                  | The channel                            |
| `role()`        | `getRole()`                                     | The role                               |
| `mentionable()` | `getMentionable()`                              | A user, member or role                 |
| `attachment()`  | `getAttachment()`                               | The attachment                         |

Every getter only accepts the names of options of its own kind. What it returns is the same as in your library, so `getUser()` returns a `User` on discord.js and an `APIUser` with raw payloads.

## Required options [#required-options]

A getter returns `null` unless the option is `required: true`, in which case Discord always sends it and the type is not nullable:

```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { chatInput, string } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';
declare const interaction: ChatInputCommandInteraction;
// ---cut---
const data = chatInput({
  name: 'report',
  description: 'Report something',
  options: {
    title: string({ description: 'Title', required: true }),
    details: string({ description: 'Details' }),
  },
});

const options = typedOptions(data, interaction);

const title = options.getString('title');
//    ^?
const details = options.getString('details');
//    ^?
```

## Choices [#choices]

When an option has `choices`, the getter returns the union of their values:

```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { chatInput, integer, string } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';
declare const interaction: ChatInputCommandInteraction;
// ---cut---
const data = chatInput({
  name: 'ban',
  description: 'Ban a member',
  options: {
    mode: string({
      description: 'How',
      required: true,
      choices: [
        { name: 'Soft', value: 'soft' },
        { name: 'Hard', value: 'hard' },
      ],
    }),
    days: integer({
      description: 'Days of messages to delete',
      choices: [
        { name: 'None', value: 0 },
        { name: 'Week', value: 7 },
      ],
    }),
  },
});

const options = typedOptions(data, interaction);

const mode = options.getString('mode');
//    ^?
const days = options.getInteger('days');
//    ^?
```

## Users and members [#users-and-members]

A `user()` option resolves to a user, but the user might not be in the guild (or the command might run in a DM), so `getMember()` is **always** nullable, even for required options:

```ts twoslash
import type { ChatInputCommandInteraction } from 'discord.js';
import { chatInput, user } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';
declare const interaction: ChatInputCommandInteraction;
// ---cut---
const data = chatInput({
  name: 'kick',
  description: 'Kick a member',
  options: {
    target: user({ description: 'Who', required: true }),
  },
});

const options = typedOptions(data, interaction);

const target = options.getUser('target');
//    ^?
const member = options.getMember('target');
//    ^?
```

## Channels [#channels]

`channel_types` narrows the channel the getter returns:

```ts twoslash
import { ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import { channel, chatInput } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs';
declare const interaction: ChatInputCommandInteraction;
// ---cut---
const data = chatInput({
  name: 'log',
  description: 'Set the log channel',
  options: {
    target: channel({
      description: 'Where',
      required: true,
      channel_types: [ChannelType.GuildText],
    }),
  },
});

const options = typedOptions(data, interaction);

const target = options.getChannel('target');
//    ^?
```

## Mentionables [#mentionables]

`getMentionable()` returns the union of what a mentionable can be: a user, a member or a role. Use `getMember()` and `getRole()` for the other kinds' own options.

## Raw payloads [#raw-payloads]

With `@nyx-discord/typed-options/djs-core` there is no library to resolve the options for you, so `typedOptions()` reads them from the payload and looks up the users, members, channels, roles and attachments in `resolved` by their ID. Options missing from the payload are `null`:

```ts twoslash
import type { APIChatInputApplicationCommandInteraction } from '@discordjs/core';
import { chatInput, user } from '@nyx-discord/typed-options';
import { typedOptions } from '@nyx-discord/typed-options/djs-core';
declare const payload: APIChatInputApplicationCommandInteraction;
// ---cut---
const data = chatInput({
  name: 'kick',
  description: 'Kick a member',
  options: {
    target: user({ description: 'Who', required: true }),
  },
});

const options = typedOptions(data, payload);

const target = options.getUser('target');
//    ^?
```

It takes the interaction payload itself, or the `@discordjs/core` event props that wrap it as `data`, so it works the same for the gateway, for [HTTP bots](/use/http) and for any other library.
