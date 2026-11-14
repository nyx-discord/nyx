# Schedules Overview (https://nyx-discord.github.io/nyx/guide/use/schedules)

`Schedules` are objects that are ticked some time in the future, and can be used as a feature complete way of scheduling events in your bot, apart from Node's `setInterval()` API.

In essence, a `Schedule` object contains its ticking logic and its interval of when it wishes to be executed, which can be in [cron](https://crontab.guru/) format, in an amount of ms (`number`), or as a `Date`.

## Quick example [#quick-example]

Let's create a schedule that updates the activity with the member count every half hour:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { type DjsBot } from '@nyx-discord/djs';
declare const bot: DjsBot;
// ---cut---
import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/djs';

class MemberCountSchedule extends AbstractSchedule {
  protected readonly interval = '*/30 * * * *';

  public async tick(meta: Metadata) {
    // the discord.js Client of the bot that ticked this schedule
    const client = TypedFields.getClient(meta);
    if (!client.user) return;

    const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    await client.user.setActivity(`Members: ${memberCount}`);
  }
}

await bot.getScheduleManager().addSchedule(new MemberCountSchedule());
```
  </Tab>
  <Tab>
```ts twoslash
import { type Bot as CoreBot } from '@nyx-discord/djs-core';
declare const bot: CoreBot;
// ---cut---
import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/djs-core';
import { ActivityType, PresenceUpdateStatus } from '@discordjs/core';

class MemberCountSchedule extends AbstractSchedule {
  protected readonly interval = '*/30 * * * *';

  public async tick(meta: Metadata) {
    // the gateway Client of the bot that ticked this schedule, which presences need
    const client = TypedFields.getClient(meta);
    const api = client.api;

    // Ideally you should cache and update these, but it's a simple example
    const guilds = await api.users.getGuilds({ with_counts: true });

    const memberCount = guilds.reduce((acc, guild) => acc + (guild.approximate_member_count ?? 0), 0);

    await client.updatePresence(
      0, // Shard ID
      {
        since: null,
        activities: [{ name: `Members: ${memberCount}`, type: ActivityType.Playing }],
        status: PresenceUpdateStatus.Online,
        afk: false,
      },
    );
  }
}

await bot.getScheduleManager().addSchedule(new MemberCountSchedule());
```
  </Tab>
  <Tab>
Presences are set through the gateway connection, so HTTP bots can't set them. Schedules themselves work the same as
with `@discordjs/core`, as long as the process stays alive.
  </Tab>
</Tabs>

Given it uses the provided metadata, it'll work even if the same instance is used across multiple bots.

## Schedule Job [#schedule-job]

When a schedule is added, a job will be created for it, which is responsible for notifying the framework when it is time to run it.
It's a wrapper over a more "lower-level" component that will actually do the ticking, like a cron job, a timer, etc.

<Callout>
  How the job is created is entirely customizable.
  By default, cron strings and `Date`s use the [croner npm package](https://www.npmjs.com/package/croner), and millisecond intervals use a timer with millisecond precision.
</Callout>

There are multiple ways to get it, but given a schedule itself does not depend on a bot, you'll always need the bot:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import type { NyxBot, Schedule } from '@nyx-discord/djs';
declare const bot: NyxBot;
declare const schedule: Schedule;
// ---cut---
const fromScheduler = bot.getScheduleManager().getScheduler().getJobForSchedule(schedule);
const fromSchedule = schedule.getJob(bot);
const whenBeingAdded = await bot.getScheduleManager().addSchedule(schedule);
```
  </Tab>
  <Tab>
```ts twoslash
import type { NyxBot, Schedule } from '@nyx-discord/djs-core';
declare const bot: NyxBot;
declare const schedule: Schedule;
// ---cut---
const fromScheduler = bot.getScheduleManager().getScheduler().getJobForSchedule(schedule);
const fromSchedule = schedule.getJob(bot);
const whenBeingAdded = await bot.getScheduleManager().addSchedule(schedule);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import type { NyxBot, Schedule } from '@nyx-discord/http';
declare const bot: NyxBot;
declare const schedule: Schedule;
// ---cut---
const fromScheduler = bot.getScheduleManager().getScheduler().getJobForSchedule(schedule);
const fromSchedule = schedule.getJob(bot);
const whenBeingAdded = await bot.getScheduleManager().addSchedule(schedule);
```
  </Tab>
</Tabs>

It's the entry point for interacting with the schedule's ticking logic, and can be used to pause or resume it externally.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import type { UndestroyableScheduleJobAdapter } from '@nyx-discord/djs';
declare const job: UndestroyableScheduleJobAdapter<unknown>;
// ---cut---
await job.pause();
await job.resume();

// A croner `Cron` for cron strings and Dates, or the current timeout for ms intervals
// Depending on this is fragile and not intended, but it doesn't change for the same major version
const rawTicker = job.getRaw();
```
  </Tab>
  <Tab>
```ts twoslash
import type { UndestroyableScheduleJobAdapter } from '@nyx-discord/djs-core';
declare const job: UndestroyableScheduleJobAdapter<unknown>;
// ---cut---
await job.pause();
await job.resume();

// A croner `Cron` for cron strings and Dates, or the current timeout for ms intervals
// Depending on this is fragile and not intended, but it doesn't change for the same major version
const rawTicker = job.getRaw();
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import type { UndestroyableScheduleJobAdapter } from '@nyx-discord/http';
declare const job: UndestroyableScheduleJobAdapter<unknown>;
// ---cut---
await job.pause();
await job.resume();

// A croner `Cron` for cron strings and Dates, or the current timeout for ms intervals
// Depending on this is fragile and not intended, but it doesn't change for the same major version
const rawTicker = job.getRaw();
```
  </Tab>
</Tabs>

## Metadata [#metadata]

When extending nyx with plugins, you may want to specify extra data for them. You can do so with the `Metadata` object, saved on the schedule.

<Callout>
While schedules internally save a `Metadata`, the return type of `#getMeta()` is a `ReadonlyMetadata`,
meaning that external objects can read the object, but not modify it.
</Callout>

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { AbstractSchedule } from '@nyx-discord/djs';

// ---cut-start---
// @ts-expect-error Incomplete example
// ---cut-end---
class MySchedule extends AbstractSchedule {
  protected override readonly meta = {
    someKey: 'someValue',
  };
}

const schedule = new MySchedule();
const meta = schedule.getMeta();
const value = meta['someKey']; // 'someValue'
```
  </Tab>
  <Tab>
```ts twoslash
import { AbstractSchedule } from '@nyx-discord/djs-core';

// ---cut-start---
// @ts-expect-error Incomplete example
// ---cut-end---
class MySchedule extends AbstractSchedule {
  protected override readonly meta = {
    someKey: 'someValue',
  };
}

const schedule = new MySchedule();
const meta = schedule.getMeta();
const value = meta['someKey']; // 'someValue'
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { AbstractSchedule } from '@nyx-discord/http';

// ---cut-start---
// @ts-expect-error Incomplete example
// ---cut-end---
class MySchedule extends AbstractSchedule {
  protected override readonly meta = {
    someKey: 'someValue',
  };
}

const schedule = new MySchedule();
const meta = schedule.getMeta();
const value = meta['someKey']; // 'someValue'
```
  </Tab>
</Tabs>

For a more type-safe approach, you can use `TypedFields`. Check the [Metadata](/use/other/meta) page for more information.
