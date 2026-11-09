# Middlewares (https://nyx-discord.github.io/nyx/guide@v3/use/commands/middlewares)

Middlewares are objects or callbacks that run before any command is executed. They can do some pre-processing logic and store it in the metadata, or even prevent the command from being executed.

For general information about middlewares, you must first read the general [Middlewares](/use/other/middlewares) guide.

## Usage [#usage]

<Steps>
<Step>

### Creation [#creation]

Either:
- Create a class that extends `BaseCommandMiddleware` and implements the `check()` method.
<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BaseCommandMiddleware } from '@nyx-discord/djs';
import type { AnyExecutableCommand, CommandResolvableInteraction, DjsInteractionTypes, Metadata, MiddlewareResponse } from '@nyx-discord/djs';

class MyMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<DjsInteractionTypes>,
    meta: Metadata
  ): Promise<MiddlewareResponse> {
    // Do some pre-processing logic
    return this.true();
  }
}
```
  </Tab>
  <Tab>
```ts twoslash
import { BaseCommandMiddleware } from '@nyx-discord/djs-core';
import type { AnyExecutableCommand, CommandResolvableInteraction, CoreInteractionTypes, Metadata, MiddlewareResponse } from '@nyx-discord/djs-core';

class MyMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<CoreInteractionTypes>,
    meta: Metadata
  ): Promise<MiddlewareResponse> {
    // Do some pre-processing logic
    return this.true();
  }
}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BaseCommandMiddleware } from '@nyx-discord/http';
import type { AnyExecutableCommand, CommandResolvableInteraction, CoreInteractionTypes, Metadata, MiddlewareResponse } from '@nyx-discord/http';

class MyMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<CoreInteractionTypes>,
    meta: Metadata
  ): Promise<MiddlewareResponse> {
    // Do some pre-processing logic
    return this.true();
  }
}
```
  </Tab>
</Tabs>

- Create a function that returns a `MiddlewareResponse`.
<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { type CommandMiddlewareResolvable, MiddlewareResponse } from '@nyx-discord/djs';

const myCallbackMiddleware: CommandMiddlewareResolvable = async (command, interaction, meta) => {
  // Do some pre-processing logic
  return {
    allowed: true,
    checkNext: true,
  };
};
```
  </Tab>
  <Tab>
```ts twoslash
import { type CommandMiddlewareResolvable, MiddlewareResponse } from '@nyx-discord/djs-core';

const myCallbackMiddleware: CommandMiddlewareResolvable = async (command, interaction, meta) => {
  // Do some pre-processing logic
  return {
    allowed: true,
    checkNext: true,
  };
};
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { type CommandMiddlewareResolvable, MiddlewareResponse } from '@nyx-discord/http';

const myCallbackMiddleware: CommandMiddlewareResolvable = async (command, interaction, meta) => {
  // Do some pre-processing logic
  return {
    allowed: true,
    checkNext: true,
  };
};
```
  </Tab>
</Tabs>

</Step>
<Step>

### Registration [#registration]

Register it to the executor's `MiddlewareList`:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import type { NyxBot, BaseCommandMiddleware, CommandMiddlewareResolvable } from '@nyx-discord/djs';
declare const MyMiddleware: new () => BaseCommandMiddleware;
declare const myCallbackMiddleware: CommandMiddlewareResolvable;
declare const bot: NyxBot;
// ---cut---
bot.getCommandManager().getExecutor().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
  <Tab>
```ts twoslash
import type { NyxBot, BaseCommandMiddleware, CommandMiddlewareResolvable } from '@nyx-discord/djs-core';
declare const MyMiddleware: new () => BaseCommandMiddleware;
declare const myCallbackMiddleware: CommandMiddlewareResolvable;
declare const bot: NyxBot;
// ---cut---
bot.getCommandManager().getExecutor().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import type { NyxBot, BaseCommandMiddleware, CommandMiddlewareResolvable } from '@nyx-discord/http';
declare const MyMiddleware: new () => BaseCommandMiddleware;
declare const myCallbackMiddleware: CommandMiddlewareResolvable;
declare const bot: NyxBot;
// ---cut---
bot.getCommandManager().getExecutor().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
</Tabs>

</Step>
</Steps>

## Examples [#examples]

### Logging middleware [#logging-middleware]

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BaseCommandMiddleware } from '@nyx-discord/djs';
import type { AnyExecutableCommand, CommandResolvableInteraction, DjsInteractionTypes, Metadata } from '@nyx-discord/djs';

class LoggingMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<DjsInteractionTypes>,
    meta: Metadata
  ) {
    console.log(`User ${interaction.user.tag} is executing command ${command.getData().name}`);
    return this.true();
  }
}
```
  </Tab>
  <Tab>
```ts twoslash
import { BaseCommandMiddleware } from '@nyx-discord/djs-core';
import type { AnyExecutableCommand, CommandResolvableInteraction, CoreInteractionTypes, Metadata } from '@nyx-discord/djs-core';

class LoggingMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<CoreInteractionTypes>,
    meta: Metadata
  ) {
    const user = interaction.data.user ?? interaction.data.member?.user;
    console.log(`User ${user?.username} is executing command ${command.getData().name}`);
    return this.true();
  }
}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BaseCommandMiddleware } from '@nyx-discord/http';
import type { AnyExecutableCommand, CommandResolvableInteraction, CoreInteractionTypes, Metadata } from '@nyx-discord/http';

class LoggingMiddleware extends BaseCommandMiddleware {
  public async check(
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction<CoreInteractionTypes>,
    meta: Metadata
  ) {
    const user = interaction.data.user ?? interaction.data.member?.user;
    console.log(`User ${user?.username} is executing command ${command.getData().name}`);
    return this.true();
  }
}
```
  </Tab>
</Tabs>
