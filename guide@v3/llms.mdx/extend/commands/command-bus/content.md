# Bus (https://nyx-discord.github.io/nyx/guide@v3/extend/commands/command-bus)

The `CommandBus` is the [`EventBus`](/use/events/busses) used for emitting command events.

## Overriding [#overriding]

<Steps>
<Step>
## Creation and Registration [#creation-and-registration]

Create your own bus [in any way](/use/events/buses) and set it to the [`CommandManager`](/extend/commands/command-manager).

<Tabs items={['discord.js', '@discordjs/core']}>
  <Tab>
```ts twoslash
import { type CommandEventArgs, type NyxBot } from '@nyx-discord/djs';
import { Client, type ClientEvents } from 'discord.js';
declare const client: Client;
declare const bot: NyxBot;
// ---cut---
import { BasicEventBus } from '@nyx-discord/djs';

class MyCommandBus extends BasicEventBus<CommandEventArgs> {
  /** Your overrides */
}

const commandBus = MyCommandBus.createAsync();

await bot.getCommandManager().setEventBus(commandBus);
```
  </Tab>
  <Tab>
```ts twoslash
import { type CommandEventArgs, type NyxBot } from '@nyx-discord/djs-core';
import { Client, type ClientEvents } from 'discord.js';
declare const client: Client;
declare const bot: NyxBot;
// ---cut---
import { BasicEventBus } from '@nyx-discord/djs-core';

class MyCommandBus extends BasicEventBus<CommandEventArgs> {
  /** Your overrides */
}

const commandBus = MyCommandBus.createAsync();

await bot.getCommandManager().setEventBus(commandBus);
```
  </Tab>
</Tabs>

The <DocsLink pkg='base' name='BasicEventBus.createSync()' decorated={false} /> (or
<DocsLink pkg='base' name='BasicEventBus.createAsync()' decorated={false} />) method instantiates your custom bus,
not the default one.

</Step>
</Steps>
