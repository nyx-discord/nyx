# Events (https://nyx-discord.github.io/nyx/guide/use/schedules/events)

<Callout type="warn">It's recommended to read the [Events Overview](../events/index) and [Event Subscribers](../events/subscribers) pages first.</Callout>

The `ScheduleManager` has an `EventBus` that allows you to listen to events related to schedules.

This is useful for monitoring, logging, or any other custom logic you want to execute when a schedule is added or removed.

## Events [#events]

The following events are available:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { ScheduleEventEnum } from '@nyx-discord/djs';

// @noErrors
ScheduleEventEnum.
//                ^|
```
  </Tab>
  <Tab>
```ts twoslash
import { ScheduleEventEnum } from '@nyx-discord/djs-core';

// @noErrors
ScheduleEventEnum.
//                ^|
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { ScheduleEventEnum } from '@nyx-discord/http';

// @noErrors
ScheduleEventEnum.
//                ^|
```
  </Tab>
</Tabs>

## Usage [#usage]

<Steps>
<Step>
### Subscriber creation [#subscriber-creation]

Create a subscriber that will listen to a given event, use the `ScheduleEventArgs` type for the arguments map. Check the [Event Subscribers](../events/subscribers) page for more information.

</Step>
<Step>
### Subscription [#subscription]

Subscribe to the event using the `ScheduleManager`'s `subscribe()` method.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
// ---cut-start---
import { EventSubscriber, ScheduleEventArgs } from '@nyx-discord/djs';
declare const subscriber: EventSubscriber<ScheduleEventArgs, keyof ScheduleEventArgs>;
import type { NyxBot } from '@nyx-discord/djs';
declare const bot: NyxBot;
// ---cut-end---
await bot.getScheduleManager().subscribe(subscriber);
```
  </Tab>
  <Tab>
```ts twoslash
// ---cut-start---
import { EventSubscriber, ScheduleEventArgs } from '@nyx-discord/djs-core';
declare const subscriber: EventSubscriber<ScheduleEventArgs, keyof ScheduleEventArgs>;
import type { NyxBot } from '@nyx-discord/djs-core';
declare const bot: NyxBot;
// ---cut-end---
await bot.getScheduleManager().subscribe(subscriber);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
// ---cut-start---
import { EventSubscriber, ScheduleEventArgs } from '@nyx-discord/http';
declare const subscriber: EventSubscriber<ScheduleEventArgs, keyof ScheduleEventArgs>;
import type { NyxBot } from '@nyx-discord/http';
declare const bot: NyxBot;
// ---cut-end---
await bot.getScheduleManager().subscribe(subscriber);
```
  </Tab>
</Tabs>
</Step>
</Steps>
