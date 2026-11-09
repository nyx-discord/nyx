# Middleware List (https://nyx-discord.github.io/nyx/guide/extend/events/dispatcher/event-middleware-list)

The `SubscriberMiddlewareList` holds and executes the middlewares used by an `EventDispatcher` before each subscriber is called.

It's inside the [`CommandExecutor`](/extend/commands/executor) object, and will be used by it.

## When to override [#when-to-override]

| ✅ Override if you want to... | ❌ Don't override if you want to... |
|---|---|
| Add custom behavior before/after middleware checks. | Change subscriber execution order. That's controlled by the bus and its sorter. |
| Change how middleware errors are wrapped or reported. | Handle subscriber errors. Use the dispatcher's [`ErrorHandler`](/use/other/error-handling) for that. |
| Replace the default middleware chain globally for a dispatcher. | Override all dispatcher logic. If only middleware behavior changes, replacing the list is enough. |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom middleware list by either:

* Extending `SubscriberMiddlewareList` (recommended, less work).
* Implementing `MiddlewareList<EventSubscriberMiddlewareResolvable>`.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { SubscriberMiddlewareList } from '@nyx-discord/djs';

class MyMiddlewareList extends SubscriberMiddlewareList {}
```
  </Tab>
  <Tab>
```ts twoslash
import { SubscriberMiddlewareList } from '@nyx-discord/djs-core';

class MyMiddlewareList extends SubscriberMiddlewareList {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { SubscriberMiddlewareList } from '@nyx-discord/http';

class MyMiddlewareList extends SubscriberMiddlewareList {}
```
  </Tab>
</Tabs>

</Step>
<Step>
### Registration [#registration]

Inject it directly when creating the dispatcher:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import {
  SubscriberMiddlewareList,
  type EventBus,
} from '@nyx-discord/djs';

declare const bus: EventBus<{ someEvent: [string] }>;

class MyMiddlewareList extends SubscriberMiddlewareList {}
// ---cut---
import { BasicSyncEventDispatcher } from '@nyx-discord/djs';

// Works the same with the async dispatcher
const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    middleware: MyMiddlewareList.create(),
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
  <Tab>
```ts twoslash
import {
  SubscriberMiddlewareList,
  type EventBus,
} from '@nyx-discord/djs-core';

declare const bus: EventBus<{ someEvent: [string] }>;

class MyMiddlewareList extends SubscriberMiddlewareList {}
// ---cut---
import { BasicSyncEventDispatcher } from '@nyx-discord/djs-core';

// Works the same with the async dispatcher
const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    middleware: MyMiddlewareList.create(),
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import {
  SubscriberMiddlewareList,
  type EventBus,
} from '@nyx-discord/http';

declare const bus: EventBus<{ someEvent: [string] }>;

class MyMiddlewareList extends SubscriberMiddlewareList {}
// ---cut---
import { BasicSyncEventDispatcher } from '@nyx-discord/http';

// Works the same with the async dispatcher
const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    middleware: MyMiddlewareList.create(),
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
</Tabs>

If you prefer, you can still wrap this in a custom dispatcher class and call `super.create(...)`.

</Step>
</Steps>
