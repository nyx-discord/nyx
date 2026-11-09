# Buses (https://nyx-discord.github.io/nyx/guide/extend/events/event-bus)

The `EventBus` is the component that stores subscribers and allows events to be emitted to them.

## When to override [#when-to-override]

| ✅ Override if you want to... | ❌ Don't override if you want to... |
|---|---|
| Wrap a new event source (e.g. Redis, WebSockets). | Change how subscribers are called (use a [custom Dispatcher](/extend/events/dispatcher) instead). |
| Change how subscribers are stored or retrieved. | Filter events globally (use a [Middleware](/use/events/middlewares) instead). |

## Overriding [#overriding]

<Steps>
<Step>
### Creation [#creation]

Create a custom event bus by either:

* Extending `BasicEventBus` (recommended for general purpose).
* Extending `BasicEventEmitterBus` (recommended if wrapping a Node.js `EventEmitter`).
* Implementing `EventBus` from scratch.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BasicEventBus } from '@nyx-discord/djs';

class MyEventBus extends BasicEventBus<{ myEvent: [string] }> {}
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicEventBus } from '@nyx-discord/djs-core';

class MyEventBus extends BasicEventBus<{ myEvent: [string] }> {}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BasicEventBus } from '@nyx-discord/http';

class MyEventBus extends BasicEventBus<{ myEvent: [string] }> {}
```
  </Tab>
</Tabs>

</Step>
<Step>
### Adapting external sources [#adapting-external-sources]

If you are wrapping an external source, you can listen to it and call `emit()`:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { BasicEventBus, BasicSyncEventDispatcher, DefaultMetadataFactory } from '@nyx-discord/djs';
import type { Identifier, MetadataFactory } from '@nyx-discord/djs';

// Mock external source
declare const socket: { on: (event: string, cb: (data: string) => void) => void };

class MySocketBus extends BasicEventBus<{ message: [string] }> {
  constructor(
    metaFactory: MetadataFactory = new DefaultMetadataFactory(),
  ) {
    super(
        (a, b) => a.getPriority() - b.getPriority(),
        BasicSyncEventDispatcher.create(),
        metaFactory
    );

    // Listen to external source and emit internally
    socket.on('message', (data) => {
      this.emit('message', [data]);
    });
  }
}
```
  </Tab>
  <Tab>
```ts twoslash
import { BasicEventBus, BasicSyncEventDispatcher, DefaultMetadataFactory } from '@nyx-discord/djs-core';
import type { Identifier, MetadataFactory } from '@nyx-discord/djs-core';

// Mock external source
declare const socket: { on: (event: string, cb: (data: string) => void) => void };

class MySocketBus extends BasicEventBus<{ message: [string] }> {
  constructor(
    metaFactory: MetadataFactory = new DefaultMetadataFactory(),
  ) {
    super(
        (a, b) => a.getPriority() - b.getPriority(),
        BasicSyncEventDispatcher.create(),
        metaFactory
    );

    // Listen to external source and emit internally
    socket.on('message', (data) => {
      this.emit('message', [data]);
    });
  }
}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { BasicEventBus, BasicSyncEventDispatcher, DefaultMetadataFactory } from '@nyx-discord/http';
import type { Identifier, MetadataFactory } from '@nyx-discord/http';

// Mock external source
declare const socket: { on: (event: string, cb: (data: string) => void) => void };

class MySocketBus extends BasicEventBus<{ message: [string] }> {
  constructor(
    metaFactory: MetadataFactory = new DefaultMetadataFactory(),
  ) {
    super(
        (a, b) => a.getPriority() - b.getPriority(),
        BasicSyncEventDispatcher.create(),
        metaFactory
    );

    // Listen to external source and emit internally
    socket.on('message', (data) => {
      this.emit('message', [data]);
    });
  }
}
```
  </Tab>
</Tabs>

</Step>
</Steps>
