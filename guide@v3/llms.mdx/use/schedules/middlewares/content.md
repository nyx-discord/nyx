# Middlewares (https://nyx-discord.github.io/nyx/guide@v3/use/schedules/middlewares)

Middlewares are objects or callbacks that run before any schedule is executed. They can do some pre-processing logic and store it in the metadata, or even prevent the subscriber from being executed.

For general information about middlewares, you must first read the general [Middlewares](/use/other/middlewares) guide.

## Usage [#usage]

<Steps>
<Step>

### Creation [#creation]

Either:
- Create a class that extends `AbstractScheduleMiddleware` and implements the `check()` method.
<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { AbstractScheduleMiddleware } from '@nyx-discord/djs';
import type { Schedule, Metadata, MiddlewareResponse } from '@nyx-discord/djs';

class MyMiddleware extends AbstractScheduleMiddleware {
  public async check(
    schedule: Schedule,
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
import { AbstractScheduleMiddleware } from '@nyx-discord/djs-core';
import type { Schedule, Metadata, MiddlewareResponse } from '@nyx-discord/djs-core';

class MyMiddleware extends AbstractScheduleMiddleware {
  public async check(
    schedule: Schedule,
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
import { AbstractScheduleMiddleware } from '@nyx-discord/http';
import type { Schedule, Metadata, MiddlewareResponse } from '@nyx-discord/http';

class MyMiddleware extends AbstractScheduleMiddleware {
  public async check(
    schedule: Schedule,
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
import { type ScheduleMiddlewareResolvable } from '@nyx-discord/djs';

const myCallbackMiddleware: ScheduleMiddlewareResolvable = async (schedule, meta) => {
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
import { type ScheduleMiddlewareResolvable } from '@nyx-discord/djs-core';

const myCallbackMiddleware: ScheduleMiddlewareResolvable = async (schedule, meta) => {
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
import { type ScheduleMiddlewareResolvable } from '@nyx-discord/http';

const myCallbackMiddleware: ScheduleMiddlewareResolvable = async (schedule, meta) => {
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
import type { AbstractScheduleMiddleware, ScheduleMiddlewareResolvable, NyxBot } from '@nyx-discord/djs';
declare const MyMiddleware: new () => AbstractScheduleMiddleware;
declare const myCallbackMiddleware: ScheduleMiddlewareResolvable;
declare const bot: NyxBot;
// ---cut---
bot.getScheduleManager().getExecutor().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
  <Tab>
```ts twoslash
import type { AbstractScheduleMiddleware, ScheduleMiddlewareResolvable, NyxBot } from '@nyx-discord/djs-core';
declare const MyMiddleware: new () => AbstractScheduleMiddleware;
declare const myCallbackMiddleware: ScheduleMiddlewareResolvable;
declare const bot: NyxBot;
// ---cut---
bot.getScheduleManager().getExecutor().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import type { AbstractScheduleMiddleware, ScheduleMiddlewareResolvable, NyxBot } from '@nyx-discord/http';
declare const MyMiddleware: new () => AbstractScheduleMiddleware;
declare const myCallbackMiddleware: ScheduleMiddlewareResolvable;
declare const bot: NyxBot;
// ---cut---
bot.getScheduleManager().getExecutor().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
</Tabs>

</Step>
</Steps>
