# Error Handler (https://nyx-discord.github.io/nyx/guide/extend/events/dispatcher/event-error-handler)

The `EventSubscriberErrorHandler` handles errors thrown while checking middlewares or executing event subscribers.

It's inside the [`EventDispatcher`](/extend/events/dispatcher) object, and will be used by it.

## When to override [#when-to-override]

| ✅ Override if you want to... | ❌ Don't override if you want to... |
|---|---|
| Resolve error consumers with custom logic. | Add/remove subscribers from buses. That's done with `EventBus#subscribe()` and `EventBus#unsubscribe()`. |
| Change fallback behavior for uncaught errors (logging, telemetry, alerting). | Change middleware order. Use the dispatcher middleware list for that. |
| Route specific error classes to specialized consumers. | Replace dispatch flow entirely. If you only want custom error handling, replacing this dependency is enough. |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom error handler by either:

* Extending `BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs>` (recommended, less work).
* Implementing `EventSubscriberErrorHandler`.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BasicErrorHandler, type AnyEventSubscriber, type EventDispatchArgs } from '@nyx-discord/djs';

class MyErrorHandler extends BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs> {}
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicErrorHandler, type AnyEventSubscriber, type EventDispatchArgs } from '@nyx-discord/djs-core';

class MyErrorHandler extends BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs> {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BasicErrorHandler, type AnyEventSubscriber, type EventDispatchArgs } from '@nyx-discord/http';

class MyErrorHandler extends BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs> {}
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
  BasicErrorHandler,
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventBus,
} from '@nyx-discord/djs';

declare const bus: EventBus<{ someEvent: [string] }>;

class MyErrorHandler extends BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs> {}
// ---cut---
import { BasicSyncEventDispatcher } from '@nyx-discord/djs';

const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    errorHandler: MyErrorHandler.create(),
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
  <Tab>
```ts twoslash
import {
  BasicErrorHandler,
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventBus,
} from '@nyx-discord/djs-core';

declare const bus: EventBus<{ someEvent: [string] }>;

class MyErrorHandler extends BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs> {}
// ---cut---
import { BasicSyncEventDispatcher } from '@nyx-discord/djs-core';

const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    errorHandler: MyErrorHandler.create(),
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import {
  BasicErrorHandler,
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventBus,
} from '@nyx-discord/http';

declare const bus: EventBus<{ someEvent: [string] }>;

class MyErrorHandler extends BasicErrorHandler<AnyEventSubscriber, EventDispatchArgs> {}
// ---cut---
import { BasicSyncEventDispatcher } from '@nyx-discord/http';

const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    errorHandler: MyErrorHandler.create(),
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
</Tabs>

<Callout type="warn" title="Using the Bot's logger">
To use the bot logger as fallback, create a handler with `createWithFallbackLogger` and inject it:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import {
  BasicSyncEventDispatcher,
  BasicErrorHandler,
  TypedFields,
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventBus,
} from '@nyx-discord/djs';

type MyEvents = {
  someEvent: [string];
};

declare const bus: EventBus<MyEvents>;

const errorHandler = BasicErrorHandler.createWithFallbackLogger<AnyEventSubscriber, EventDispatchArgs>(
  (_error, _subscriber, [metadata]) => TypedFields.getLogger(metadata),
);

const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    errorHandler,
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
  <Tab>
```ts twoslash
import {
  BasicSyncEventDispatcher,
  BasicErrorHandler,
  TypedFields,
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventBus,
} from '@nyx-discord/djs-core';

type MyEvents = {
  someEvent: [string];
};

declare const bus: EventBus<MyEvents>;

const errorHandler = BasicErrorHandler.createWithFallbackLogger<AnyEventSubscriber, EventDispatchArgs>(
  (_error, _subscriber, [metadata]) => TypedFields.getLogger(metadata),
);

const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    errorHandler,
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import {
  BasicSyncEventDispatcher,
  BasicErrorHandler,
  TypedFields,
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventBus,
} from '@nyx-discord/http';

type MyEvents = {
  someEvent: [string];
};

declare const bus: EventBus<MyEvents>;

const errorHandler = BasicErrorHandler.createWithFallbackLogger<AnyEventSubscriber, EventDispatchArgs>(
  (_error, _subscriber, [metadata]) => TypedFields.getLogger(metadata),
);

const dispatcher = BasicSyncEventDispatcher.create({
  injections: {
    errorHandler,
  },
});

bus.setDispatcher(dispatcher);
```
  </Tab>
</Tabs>

</Callout>

</Step>
</Steps>
