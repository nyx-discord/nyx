# Repository (https://nyx-discord.github.io/nyx/guide/extend/schedules/schedule-repository)

The <DocsLink pkg='base' name='ScheduleRepository' decorated={false} /> is responsible for storing all the currently registered schedules.

## When to override [#when-to-override]

| ✅ Override if you want to... | ❌ Don't override if you want to... |
|---|---|
| Change schedule persistence (e.g., database instead of in-memory). | Adjust schedule execution or job lifecycle. Use `ScheduleExecutor` or `ScheduleJobAdapter` instead. |
| Enforce custom consistency/uniqueness rules at storage level (e.g., dedup by business key). | Change middleware flow or pre-execution checks. That belongs to `ScheduleMiddlewareList`. |
| Support multi-tenant partitioning or custom query/filter capabilities in storage. | Change manager event orchestration. That belongs to `ScheduleManager`. |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom schedule repository by either:

* Extending <DocsLink pkg='base' name='DefaultScheduleRepository' decorated={false} /> (<BaseMention />'s implementation, recommended for less work).
* Implementing <DocsLink pkg='base' name='ScheduleRepository' decorated={false} /> (<BaseMention />'s interface).

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { DefaultScheduleRepository } from '@nyx-discord/djs';

class MyScheduleRepository extends DefaultScheduleRepository {
  public myCustomMethod() {
    // Custom logic
  }
}
```
  </Tab>
  <Tab>
```ts twoslash
import { DefaultScheduleRepository } from '@nyx-discord/djs-core';

class MyScheduleRepository extends DefaultScheduleRepository {
  public myCustomMethod() {
    // Custom logic
  }
}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultScheduleRepository } from '@nyx-discord/http';

class MyScheduleRepository extends DefaultScheduleRepository {
  public myCustomMethod() {
    // Custom logic
  }
}
```
  </Tab>
</Tabs>

</Step>
<Step>
### Registration [#registration]

Create it and set it to the [`ScheduleManager`](/extend/schedules/schedule-manager).

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { DefaultScheduleRepository } from '@nyx-discord/djs';
import type { NyxBot } from '@nyx-discord/djs';
declare const bot: NyxBot;
// ---cut---
class MyScheduleRepository extends DefaultScheduleRepository {
  /** Your overrides */
}

bot.getScheduleManager().setRepository(MyScheduleRepository.create());
```
  </Tab>
  <Tab>
```ts twoslash
import { DefaultScheduleRepository } from '@nyx-discord/djs-core';
import type { NyxBot } from '@nyx-discord/djs-core';
declare const bot: NyxBot;
// ---cut---
class MyScheduleRepository extends DefaultScheduleRepository {
  /** Your overrides */
}

bot.getScheduleManager().setRepository(MyScheduleRepository.create());
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultScheduleRepository } from '@nyx-discord/http';
import type { NyxBot } from '@nyx-discord/http';
declare const bot: NyxBot;
// ---cut---
class MyScheduleRepository extends DefaultScheduleRepository {
  /** Your overrides */
}

bot.getScheduleManager().setRepository(MyScheduleRepository.create());
```
  </Tab>
</Tabs>

The <DocsLink pkg='base' name='DefaultScheduleRepository.create()' decorated={false} /> method instantiates your custom repository, not the default one.

</Step>
</Steps>
