# Deployer (https://nyx-discord.github.io/nyx/guide@v3/extend/commands/command-deployer)

The `CommandDeployer` is responsible for deploying commands to Discord and storing the [ApplicationCommand](https://discord.js.org/docs/packages/discord.js/stable/ApplicationCommand:Class) mappings.

## When to override [#when-to-override]

| ✅ Override if you want to...        | ❌ Don't override if you want to...                                                                                                                         |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Deploy commands in a different way. | Change command serialization. That is done in the command itself, you can override your `data` property or `getData()` method instead.                     |
|                                     | Deploy commands conditionally or manually. Instead, return `deployCommands: false` on `Bot.create()` and call `CommandManager#deploy()` when you want.     |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom deployer by either:

* Extending `DefaultCommandDeployer` (recommended, less work).
* Implementing `CommandDeployer`.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { DefaultCommandDeployer } from '@nyx-discord/djs';

class MyCommandDeployer extends DefaultCommandDeployer {}
```
  </Tab>
  <Tab>
```ts twoslash
import { DefaultCommandDeployer } from '@nyx-discord/djs-core';

class MyCommandDeployer extends DefaultCommandDeployer {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultCommandDeployer } from '@nyx-discord/http';

class MyCommandDeployer extends DefaultCommandDeployer {}
```
  </Tab>
</Tabs>

</Step>
<Step>
### Registration [#registration]

Create it and set it to the [`CommandManager`](/extend/commands/command-manager).

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { DefaultCommandDeployer } from '@nyx-discord/djs';
import { Client } from 'discord.js';
import type { Bot } from '@nyx-discord/djs';
declare const client: Client;
declare const bot: Bot;
// ---cut---
class MyCommandDeployer extends DefaultCommandDeployer {
  /** Your overrides */
}

bot.getCommandManager().setDeployer(MyCommandDeployer.create(client));
```

The <DocsLink pkg='djs' name='DefaultCommandDeployer.create()' decorated={false} /> method instantiates your custom deployer, not the default one.
  </Tab>
  <Tab>
```ts twoslash
import { DefaultCommandDeployer, type Bot } from '@nyx-discord/djs-core';
import type { API, Snowflake } from '@discordjs/core';
declare const api: API;
declare const applicationId: Snowflake;
declare const bot: Bot;
// ---cut---
class MyCommandDeployer extends DefaultCommandDeployer {
  /** Your overrides */
}

bot.getCommandManager().setDeployer(MyCommandDeployer.create(api, applicationId));
```

The <DocsLink pkg='djs-core' name='DefaultCommandDeployer.create()' decorated={false} /> method instantiates your custom deployer, not the default one.
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultCommandDeployer, type Bot } from '@nyx-discord/http';
import type { API, Snowflake } from '@discordjs/core';
declare const api: API;
declare const applicationId: Snowflake;
declare const bot: Bot;
// ---cut---
class MyCommandDeployer extends DefaultCommandDeployer {
  /** Your overrides */
}

bot.getCommandManager().setDeployer(MyCommandDeployer.create(api, applicationId));
```

The <DocsLink pkg='djs-core' name='DefaultCommandDeployer.create()' decorated={false} /> method instantiates your custom deployer, not the default one.
  </Tab>
</Tabs>

</Step>
</Steps>
