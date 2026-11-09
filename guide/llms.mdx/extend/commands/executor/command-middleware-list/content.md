# Middleware List (https://nyx-discord.github.io/nyx/guide/extend/commands/executor/command-middleware-list)

The `CommandMiddlewareList` is responsible for holding and executing the middlewares that run before a command is executed.

It's inside the [`CommandExecutor`](/extend/commands/executor) object, and will be executed by it.

## When to override [#when-to-override]

| ✅ Override if you want to...                              | ❌ Don't override if you want to...                                        |
|-----------------------------------------------------------|---------------------------------------------------------------------------|
| Do something before, while or after checking middlewares. | Add new middlewares. The list already supports add and remove operations. |
| Check middlewares in a different way or order.            |                                                                           |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom middleware list by either:

* Extending `CommandMiddlewareList` (recommended, less work).
* Implementing `MiddlewareList<CommandMiddlewareResolvable>`.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { CommandMiddlewareList } from '@nyx-discord/djs';

class MyMiddlewareList extends CommandMiddlewareList {}
```
  </Tab>
  <Tab>
```ts twoslash
import { CommandMiddlewareList } from '@nyx-discord/djs-core';

class MyMiddlewareList extends CommandMiddlewareList {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { CommandMiddlewareList } from '@nyx-discord/http';

class MyMiddlewareList extends CommandMiddlewareList {}
```
  </Tab>
</Tabs>

</Step>
<Step>
### Registration [#registration]

Create it and set it to the [`CommandExecutor`](/extend/commands/executor), then set the executor on the [`CommandManager`](/extend/commands/command-manager).

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { CommandMiddlewareList } from '@nyx-discord/djs';
import type { Bot } from '@nyx-discord/djs';
declare const bot: Bot;
// ---cut---
import { DefaultCommandExecutor } from '@nyx-discord/djs';

class MyMiddlewareList extends CommandMiddlewareList {}

const executor = DefaultCommandExecutor.create({
  injections: {
    middleware: MyMiddlewareList.create(),
  },
});
bot.getCommandManager().setExecutor(executor);
```
  </Tab>
  <Tab>
```ts twoslash
import { CommandMiddlewareList } from '@nyx-discord/djs-core';
import type { Bot } from '@nyx-discord/djs-core';
declare const bot: Bot;
// ---cut---
import { DefaultCommandExecutor } from '@nyx-discord/djs-core';

class MyMiddlewareList extends CommandMiddlewareList {}

const executor = DefaultCommandExecutor.create({
  injections: {
    middleware: MyMiddlewareList.create(),
  },
});
bot.getCommandManager().setExecutor(executor);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { CommandMiddlewareList } from '@nyx-discord/http';
import type { Bot } from '@nyx-discord/http';
declare const bot: Bot;
// ---cut---
import { DefaultCommandExecutor } from '@nyx-discord/http';

class MyMiddlewareList extends CommandMiddlewareList {}

const executor = DefaultCommandExecutor.create({
  injections: {
    middleware: MyMiddlewareList.create(),
  },
});
bot.getCommandManager().setExecutor(executor);
```
  </Tab>
</Tabs>

The `create()` method instantiates your custom middleware list, not the default one.

</Step>
</Steps>
