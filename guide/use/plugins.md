# Plugins Overview (https://nyx-discord.github.io/nyx/guide/use/plugins)

Plugins are objects that can be used to pack functionality, such as commands, events and schedules.

## Usage [#usage]

<Steps>
<Step>
### Plugin creation [#plugin-creation]

Create a class that implements <DocsLink pkg="base" name="NyxPlugin" label={<code>NyxPlugin</code>} decorated={false}/>.

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { NyxPlugin, NyxBot } from '@nyx-discord/djs';

class MyPlugin implements NyxPlugin {
  public static readonly Id = Symbol('my-plugin');

  public async onRegister(bot: NyxBot) {
    bot.getLogger().log('My plugin has been registered!');
  }

  public async onUnregister(bot: NyxBot) {
    bot.getLogger().log('My plugin has been unregistered!');
  }

  public getData() {
    return {
      name: 'my-plugin',
      version: '1.0.0',
      description: 'My plugin',
      // Optional
      git: 'https://github.com/...',
    }
  }

  public getId() {
    return MyPlugin.Id;
  }
}
```
  </Tab>
  <Tab>
```ts twoslash
import { NyxPlugin, NyxBot } from '@nyx-discord/djs-core';

class MyPlugin implements NyxPlugin {
  public static readonly Id = Symbol('my-plugin');

  public async onRegister(bot: NyxBot) {
    bot.getLogger().log('My plugin has been registered!');
  }

  public async onUnregister(bot: NyxBot) {
    bot.getLogger().log('My plugin has been unregistered!');
  }

  public getData() {
    return {
      name: 'my-plugin',
      version: '1.0.0',
      description: 'My plugin',
      // Optional
      git: 'https://github.com/...',
    }
  }

  public getId() {
    return MyPlugin.Id;
  }
}
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { NyxPlugin, NyxBot } from '@nyx-discord/http';

class MyPlugin implements NyxPlugin {
  public static readonly Id = Symbol('my-plugin');

  public async onRegister(bot: NyxBot) {
    bot.getLogger().log('My plugin has been registered!');
  }

  public async onUnregister(bot: NyxBot) {
    bot.getLogger().log('My plugin has been unregistered!');
  }

  public getData() {
    return {
      name: 'my-plugin',
      version: '1.0.0',
      description: 'My plugin',
      // Optional
      git: 'https://github.com/...',
    }
  }

  public getId() {
    return MyPlugin.Id;
  }
}
```
  </Tab>
</Tabs>

The `getData()` method is unused by the framework, but it provides information to the plugin's consumer.

</Step>
<Step>

### Registration [#registration]

Register it to a bot's `PluginManager`:

<Tabs items={['discord.js', '@discordjs/core', 'HTTP']}>
  <Tab>
```ts twoslash
import { NyxBot, NyxPlugin } from '@nyx-discord/djs';
declare const bot: NyxBot;
declare const MyPlugin: new () => NyxPlugin;
// ---cut---
await bot.getPluginManager().register(new MyPlugin());
```
  </Tab>
  <Tab>
```ts twoslash
import { NyxBot, NyxPlugin } from '@nyx-discord/djs-core';
declare const bot: NyxBot;
declare const MyPlugin: new () => NyxPlugin;
// ---cut---
await bot.getPluginManager().register(new MyPlugin());
```
  </Tab>
  <Tab>
  Same as `@discordjs/core`, importing from `@nyx-discord/http`:

```ts twoslash
import { NyxBot, NyxPlugin } from '@nyx-discord/http';
declare const bot: NyxBot;
declare const MyPlugin: new () => NyxPlugin;
// ---cut---
await bot.getPluginManager().register(new MyPlugin());
```
  </Tab>
</Tabs>

</Step>
</Steps>
