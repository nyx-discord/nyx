# Executor (https://nyx-discord.github.io/nyx/guide@v3/extend/commands/executor)

The `CommandExecutor` is responsible for executing commands, making sure the middleware passes and handling errors.

## When to override [#when-to-override]

| ✅ Override if you want to...                                      | ❌ Don't override if you want to...                                                                                                                        |
|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Customize how commands are executed.                               | Listen for command runs. [Use the `EventBus` in the `CommandManager` instead](/use/commands/events).                                                                              |
| Add advanced logic while executing a command, like delaying calls. | Add new middlewares or error consumers. You can interact with the [`MiddlewareList`](/use/commands/middlewares) and [`ErrorHandler`](/use/other/error-handling) objects directly, using the getter on the executor. |
|                                                                    | Override the default `MiddlewareList` or `ErrorHandler`. You can do that already from the `DefaultCommandExecutor.create()` options, as shown in the respective guide of the object you want to override. |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom executor by either:

* Extending `DefaultCommandExecutor` (recommended, less work).
* Implementing `CommandExecutor`.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { DefaultCommandExecutor } from '@nyx-discord/djs';

class MyCommandExecutor extends DefaultCommandExecutor {}
```
  </Tab>
  <Tab>
```ts twoslash
import { DefaultCommandExecutor } from '@nyx-discord/djs-core';

class MyCommandExecutor extends DefaultCommandExecutor {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultCommandExecutor } from '@nyx-discord/http';

class MyCommandExecutor extends DefaultCommandExecutor {}
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
import { DefaultCommandExecutor } from '@nyx-discord/djs';
import type { Bot } from '@nyx-discord/djs';
declare const bot: Bot;
// ---cut---
class MyCommandExecutor extends DefaultCommandExecutor {}

bot.getCommandManager().setExecutor(MyCommandExecutor.create());
```
  </Tab>
  <Tab>
```ts twoslash
import { DefaultCommandExecutor } from '@nyx-discord/djs-core';
import type { Bot } from '@nyx-discord/djs-core';
declare const bot: Bot;
// ---cut---
class MyCommandExecutor extends DefaultCommandExecutor {}

bot.getCommandManager().setExecutor(MyCommandExecutor.create());
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultCommandExecutor } from '@nyx-discord/http';
import type { Bot } from '@nyx-discord/http';
declare const bot: Bot;
// ---cut---
class MyCommandExecutor extends DefaultCommandExecutor {}

bot.getCommandManager().setExecutor(MyCommandExecutor.create());
```
  </Tab>
</Tabs>

The `create()` method instantiates the executor with the default `ErrorHandler` and `MiddlewareList` (which are overridable, as described below). It'll also instantiate your custom class, not the base one.

</Step>
</Steps>

## Dependencies [#dependencies]

You can override the executor's dependencies (`ErrorHandler` and `MiddlewareList`) by passing them as options to the `DefaultCommandExecutor.create()` method. More details in the respective guides:

<Cards>
<Card title="Middleware List" href="/extend/commands/executor/command-middleware-list" icon={<LayersIcon />} external={false}>
  Holds and executes the command middlewares.
</Card>
<Card title="Error Handler" href="/extend/commands/executor/command-error-handler" icon={<AmbulanceIcon />} external={false}>
  Handles command-related errors.
</Card>
</Cards>
