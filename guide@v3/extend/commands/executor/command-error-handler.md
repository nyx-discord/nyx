# Error Handler (https://nyx-discord.github.io/nyx/guide@v3/extend/commands/executor/command-error-handler)

The `CommandErrorHandler` is responsible for handling errors thrown by middlewares and commands.

It's inside the [`CommandExecutor`](/extend/commands/executor) object, and will be used by it.

## When to override [#when-to-override]

| ✅ Override if you want to...              | ❌ Don't override if you want to...                                                 |
|-------------------------------------------|------------------------------------------------------------------------------------|
| Resolve consumers with a different logic. | Add new consumers or a fallback one. The object already supports these operations. |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom error handler by either:

* Extending `BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs>` (recommended, less work).
* Implementing `CommandErrorHandler`.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BasicErrorHandler, type AnyExecutableCommand, type CommandExecutionArgs } from '@nyx-discord/djs';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicErrorHandler, type AnyExecutableCommand, type CommandExecutionArgs } from '@nyx-discord/djs-core';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BasicErrorHandler, type AnyExecutableCommand, type CommandExecutionArgs } from '@nyx-discord/http';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
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
import { BasicErrorHandler, type AnyExecutableCommand, type CommandExecutionArgs } from '@nyx-discord/djs';
import type { Bot } from '@nyx-discord/djs';
declare const bot: Bot;
// ---cut---
import { DefaultCommandExecutor } from '@nyx-discord/djs';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}

const executor = DefaultCommandExecutor.create({
  injections: {
    errorHandler: MyErrorHandler.create(),
  },
});

bot.getCommandManager().setExecutor(executor);
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicErrorHandler, type AnyExecutableCommand, type CommandExecutionArgs } from '@nyx-discord/djs-core';
import type { Bot } from '@nyx-discord/djs-core';
declare const bot: Bot;
// ---cut---
import { DefaultCommandExecutor } from '@nyx-discord/djs-core';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}

const executor = DefaultCommandExecutor.create({
  injections: {
    errorHandler: MyErrorHandler.create(),
  },
});

bot.getCommandManager().setExecutor(executor);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BasicErrorHandler, type AnyExecutableCommand, type CommandExecutionArgs } from '@nyx-discord/http';
import type { Bot } from '@nyx-discord/http';
declare const bot: Bot;
// ---cut---
import { DefaultCommandExecutor } from '@nyx-discord/http';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}

const executor = DefaultCommandExecutor.create({
  injections: {
    errorHandler: MyErrorHandler.create(),
  },
});

bot.getCommandManager().setExecutor(executor);
```
  </Tab>
</Tabs>

The `create()` method instantiates your custom error handler, not the default one.

<Callout type="warn" title="Using the Bot's logger">
The default error handler will use `console.error` as a fallback consumer. If you want to change it to the bot's logger, instantiate it this way:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BasicErrorHandler } from '@nyx-discord/djs';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
// ---cut---
import { TypedFields } from '@nyx-discord/djs';
import type { AnyExecutableCommand, CommandExecutionArgs } from '@nyx-discord/djs';

const myHandler = MyErrorHandler.createWithFallbackLogger<AnyExecutableCommand, CommandExecutionArgs>(
  (_error, _command, [_interaction, metadata]) => {
    const bot = TypedFields.Bot.get(metadata, true);
    return bot.getLogger();
  }
);
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicErrorHandler } from '@nyx-discord/djs-core';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
// ---cut---
import { TypedFields } from '@nyx-discord/djs-core';
import type { AnyExecutableCommand, CommandExecutionArgs } from '@nyx-discord/djs-core';

const myHandler = MyErrorHandler.createWithFallbackLogger<AnyExecutableCommand, CommandExecutionArgs>(
  (_error, _command, [_interaction, metadata]) => {
    const bot = TypedFields.Bot.get(metadata, true);
    return bot.getLogger();
  }
);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BasicErrorHandler } from '@nyx-discord/http';

class MyErrorHandler extends BasicErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
// ---cut---
import { TypedFields } from '@nyx-discord/http';
import type { AnyExecutableCommand, CommandExecutionArgs } from '@nyx-discord/http';

const myHandler = MyErrorHandler.createWithFallbackLogger<AnyExecutableCommand, CommandExecutionArgs>(
  (_error, _command, [_interaction, metadata]) => {
    const bot = TypedFields.Bot.get(metadata, true);
    return bot.getLogger();
  }
);
```
  </Tab>
</Tabs>

</Callout>

</Step>
</Steps>
