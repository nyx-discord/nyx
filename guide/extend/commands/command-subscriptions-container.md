# Subscriptions Container (https://nyx-discord.github.io/nyx/guide/extend/commands/command-subscriptions-container)

The `CommandSubscriptionsContainer` is responsible for storing the subscribers that are subscribed to the [Client's `EventBus`](/use/events) to listen for command interactions.

## Overriding [#overriding]

<Steps>
<Step>
## Creation and Registration [#creation-and-registration]

Create your own container by extending `DefaultCommandSubscriptionsContainer` and set it to the [`CommandManager`](/extend/commands/command-manager).

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { DefaultCommandSubscriptionsContainer } from '@nyx-discord/djs';
import type { Bot } from '@nyx-discord/djs';
declare const bot: Bot;
// ---cut---
import { DefaultCommandInteractionSubscriber, DefaultCommandAutocompleteSubscriber } from '@nyx-discord/djs';

class MySubscriptionsContainer extends DefaultCommandSubscriptionsContainer {
  /** Your overrides */
}


const container = MySubscriptionsContainer.create(
  bot.getClientEventBus(),
  new DefaultCommandInteractionSubscriber(),
  new DefaultCommandAutocompleteSubscriber(),
);

bot.getCommandManager().setSubscriptions(container);
```
  </Tab>
  <Tab>
```ts twoslash
import { DefaultCommandSubscriptionsContainer } from '@nyx-discord/djs-core';
import type { Bot } from '@nyx-discord/djs-core';
declare const bot: Bot;
// ---cut---
import { DefaultCommandInteractionSubscriber, DefaultCommandAutocompleteSubscriber } from '@nyx-discord/djs-core';

class MySubscriptionsContainer extends DefaultCommandSubscriptionsContainer {
  /** Your overrides */
}


const container = MySubscriptionsContainer.create(
  bot.getClientEventBus(),
  new DefaultCommandInteractionSubscriber(),
  new DefaultCommandAutocompleteSubscriber(),
);

bot.getCommandManager().setSubscriptions(container);
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { DefaultCommandSubscriptionsContainer } from '@nyx-discord/http';
import type { Bot } from '@nyx-discord/http';
declare const bot: Bot;
// ---cut---
import { DefaultCommandInteractionSubscriber, DefaultCommandAutocompleteSubscriber } from '@nyx-discord/http';

class MySubscriptionsContainer extends DefaultCommandSubscriptionsContainer {
  /** Your overrides */
}


const container = MySubscriptionsContainer.create(
  bot.getClientEventBus(),
  new DefaultCommandInteractionSubscriber(),
  new DefaultCommandAutocompleteSubscriber(),
);

bot.getCommandManager().setSubscriptions(container);
```
  </Tab>
</Tabs>

The <DocsLink pkg='djs' name='DefaultCommandSubscriptionsContainer.create()' decorated={false} /> method instantiates your custom container, not the default one.

</Step>
</Steps>
