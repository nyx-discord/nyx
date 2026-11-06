# Middleware List (https://nyx-discord.github.io/nyx/guide@v3/extend/schedules/schedule-executor/schedule-middleware-list)

The `ScheduleMiddlewareList` manages the middlewares that run before a schedule `tick()` is executed. It lives inside the [`ScheduleExecutor`](/extend/schedules/schedule-executor) and is used by it.

## Middleware Execution [#middleware-execution]

Middlewares are executed sequentially. If any middleware throws an error or returns without calling `next()`, the schedule execution is aborted and the executor forwards the error to its configured handler.

The `ScheduleFilterCheckMiddleware` is a built-in middleware that runs first by default (or as configured) to check if the schedule's `filter` method allows execution.

## When to override [#when-to-override]

| ✅ Override if you want to... | ❌ Don't override if you want to... |
|---|---|
| Customize how middlewares are stored or iterated. | Add middlewares to the existing list. Use a custom `ScheduleExecutor` if you only need different injections. |
| Add priority/group ordering semantics beyond simple insertion order. | Change error handling around `tick()` execution. That belongs to `ScheduleErrorHandler`. |
| Enforce middleware deduplication or identity-based replacement rules. | Change when schedules are triggered. That belongs to `ScheduleExecutionScheduler`. |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom `ScheduleMiddlewareList` by either:

* Extending `ScheduleMiddlewareList` (recommended, less work).
* Implementing `MiddlewareList<ScheduleMiddlewareResolvable>`.

<Tabs items={['discord.js', '@discordjs/core']}>
  <Tab>
```ts twoslash
import { ScheduleMiddlewareList } from '@nyx-discord/djs';

class MyMiddlewareList extends ScheduleMiddlewareList {}
```
  </Tab>
  <Tab>
```ts twoslash
import { ScheduleMiddlewareList } from '@nyx-discord/djs-core';

class MyMiddlewareList extends ScheduleMiddlewareList {}
```
  </Tab>
</Tabs>

</Step>
<Step>
### Registration [#registration]

Inject it into a custom `DefaultScheduleExecutor`, then set that executor to the [`ScheduleManager`](/extend/schedules/schedule-manager).

<Tabs items={['discord.js', '@discordjs/core']}>
  <Tab>
```ts twoslash
import { BasicErrorHandler, DefaultScheduleExecutor, ScheduleMiddlewareList, TypedFields } from '@nyx-discord/djs';

class MyMiddlewareList extends ScheduleMiddlewareList {}
// ---cut---
import type { NyxBot } from '@nyx-discord/djs';
declare const bot: NyxBot;

const executor = new DefaultScheduleExecutor(
  MyMiddlewareList.create(),
  BasicErrorHandler.createWithFallbackLogger((_error, _schedule, [metadata]) =>
    TypedFields.Bot.get(metadata, true).getLogger(),
  ),
);

bot.getScheduleManager().setExecutor(executor);
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicErrorHandler, DefaultScheduleExecutor, ScheduleMiddlewareList, TypedFields } from '@nyx-discord/djs-core';

class MyMiddlewareList extends ScheduleMiddlewareList {}
// ---cut---
import type { NyxBot } from '@nyx-discord/djs-core';
declare const bot: NyxBot;

const executor = new DefaultScheduleExecutor(
  MyMiddlewareList.create(),
  BasicErrorHandler.createWithFallbackLogger((_error, _schedule, [metadata]) =>
    TypedFields.Bot.get(metadata, true).getLogger(),
  ),
);

bot.getScheduleManager().setExecutor(executor);
```
  </Tab>
</Tabs>

</Step>
</Steps>
