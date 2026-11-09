# Middlewares (https://nyx-discord.github.io/nyx/guide/use/events/middlewares)

Middlewares are objects or callbacks that run before any subscriber is executed. They can do some pre-processing logic and store it in the metadata, or even prevent the subscriber from being executed.

For general information about middlewares, you must first read the general [Middlewares](/use/other/middlewares) guide.

## Usage [#usage]

<Steps>
<Step>

### Creation [#creation]

Either:
- Create a class that extends `AbstractEventSubscriberMiddleware` and implements the `check()` method.
<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { AbstractEventSubscriberMiddleware } from '@nyx-discord/djs';
import type { AnyEventSubscriber, Metadata, MiddlewareResponse } from '@nyx-discord/djs';

class MyMiddleware extends AbstractEventSubscriberMiddleware {
  public async check(
    subscriber: AnyEventSubscriber,
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
import { AbstractEventSubscriberMiddleware } from '@nyx-discord/djs-core';
import type { AnyEventSubscriber, Metadata, MiddlewareResponse } from '@nyx-discord/djs-core';

class MyMiddleware extends AbstractEventSubscriberMiddleware {
  public async check(
    subscriber: AnyEventSubscriber,
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
import { AbstractEventSubscriberMiddleware } from '@nyx-discord/http';
import type { AnyEventSubscriber, Metadata, MiddlewareResponse } from '@nyx-discord/http';

class MyMiddleware extends AbstractEventSubscriberMiddleware {
  public async check(
    subscriber: AnyEventSubscriber,
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
import { type EventSubscriberMiddlewareResolvable } from '@nyx-discord/djs';

const myCallbackMiddleware: EventSubscriberMiddlewareResolvable = async (subscriber, meta) => {
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
import { type EventSubscriberMiddlewareResolvable } from '@nyx-discord/djs-core';

const myCallbackMiddleware: EventSubscriberMiddlewareResolvable = async (subscriber, meta) => {
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
import { type EventSubscriberMiddlewareResolvable } from '@nyx-discord/http';

const myCallbackMiddleware: EventSubscriberMiddlewareResolvable = async (subscriber, meta) => {
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

Register it to the dispatcher's `MiddlewareList`:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import type { EventBus, AbstractEventSubscriberMiddleware, EventSubscriberMiddlewareResolvable } from '@nyx-discord/djs';
declare const MyMiddleware: new () => AbstractEventSubscriberMiddleware;
declare const myCallbackMiddleware: EventSubscriberMiddlewareResolvable;
type MyEventsArgs = {
  someEvent: [string, number];
  anotherEvent: [boolean];
};
declare const bus: EventBus<MyEventsArgs>;
// ---cut---
bus.getDispatcher().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
  <Tab>
```ts twoslash
import type { EventBus, AbstractEventSubscriberMiddleware, EventSubscriberMiddlewareResolvable } from '@nyx-discord/djs-core';
declare const MyMiddleware: new () => AbstractEventSubscriberMiddleware;
declare const myCallbackMiddleware: EventSubscriberMiddlewareResolvable;
type MyEventsArgs = {
  someEvent: [string, number];
  anotherEvent: [boolean];
};
declare const bus: EventBus<MyEventsArgs>;
// ---cut---
bus.getDispatcher().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import type { EventBus, AbstractEventSubscriberMiddleware, EventSubscriberMiddlewareResolvable } from '@nyx-discord/http';
declare const MyMiddleware: new () => AbstractEventSubscriberMiddleware;
declare const myCallbackMiddleware: EventSubscriberMiddlewareResolvable;
type MyEventsArgs = {
  someEvent: [string, number];
  anotherEvent: [boolean];
};
declare const bus: EventBus<MyEventsArgs>;
// ---cut---
bus.getDispatcher().getMiddleware().add(new MyMiddleware(), myCallbackMiddleware);
```
  </Tab>
</Tabs>

</Step>
</Steps>
