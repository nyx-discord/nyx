![nyx Logo](assets/nyx.png)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnyx-discord%2Fnyx.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnyx-discord%2Fnyx?ref=badge_shield)

---

`nyx` is an OOP framework for building feature-complete Discord bots.

The core idea of nyx is to be easy to modify and extend, with no hardcoded implementations, meaning that all the default
objects can be completely replaced by your own if desired.

The original template that nyx is based on was greatly inspired by [Modbot](https://github.com/aternosorg/modbot).

## 📖 Documentation

nyx has two documentation sources:

* [Typedoc](https://nyx-discord.github.io/nyx/typedoc), documenting classes, types and interfaces, so you can easily
  explore the library through your browser.
* [Docusaurus](https://nyx-discord.github.io/nyx/docs), which serves as a guide for how to use and modify the framework.

## ✨ Features

All of these features are built upon interfaces (`@nyx-discord/core`), and nyx only includes default, recommended
implementations `@nyx-discord/framework`.

This means that you can build from scratch or extend each object and plug it into nyx with no problems, as long as they
satisfy the respective interface.

### Commands

* Complete application command support, with Standalone commands, Parent commands, Subcommands and SubCommand Groups.
  * Add, remove and update commands (including their children) in runtime.
  * Route interactions (buttons, select menus and modal submits) to a command, with an easy API that allows storing and
    retrieving extra data from the customId.
* Command and SubCommand option autocompletion support.
* Discord's context menus ([User](https://discord.com/developers/docs/interactions/application-commands#user-commands)
  and [Message](https://discord.com/developers/docs/interactions/application-commands#message-commands) commands)
  support.
* Replace the interaction listeners with your own for even more custom command handling.
* Deny command executions via `CommandMiddlewares` (for general command filtering) or `CommandFilters` (for
  command-specific filtering).
* Handle uncaught command errors with a provided `ErrorHandler`.

### Events

* Register multiple `EventBuses`, each with their own execution logic.
* Subscribe (and unsubscribe) to events on `EventBuses` via `EventSubscriber` objects or callback functions.
* Enforce emitting and receiving events type safely, including your custom `EventBuses`.
* Use the built-in `BotEventBus` to subscribe to `NyxBot` wide events, such as `botStop`, `commandAdd`, `scheduleRun`,
  and many more.
* Store event metadata across subscribers to share information about the event itself.
  * The metadata allows marking events as handled so the `EventMiddleware` removes subscribers that don't want to
    receive such events.
* Specify an `EventDispatcher` to change the way subscribers are called. By default, two are included:
  * The `AsyncEventDispatcher` which allows a concurrency limit.
  * The `SyncEventDispatcher` which allows a sync timeout limit before calling the next subscriber.
* Deny subscriber executions via `EventMiddlewares` (for general filtering) or `SubscriberFilters` (for subscriber
  specific filtering).
* Handle subscriber errors via a flexible `ErrorHandler`.

### Schedules

* Schedule actions to happen only at a certain time or every once on a while.
* Stop and resume `Schedules` as needed.
* Uses [Cron](https://crontab.guru/) to power the schedules.

### Sessions

* Create Sessions for making expirable, interactable user interfaces.
  * Some common examples include, pagination, listing, guiding a user through a process, among others.
* Allows routing interactions (buttons, select menus and modal submits) to the Session, to "update" their state and
  answer accordingly.
* Execute actions when a Session has already expired, but an interaction referencing that Session is received, such as
  telling the user to execute a command again.

### Plugins

* Create your own plugins that can be loaded inside nyx to allow for even further extensibility.
* Plugins can depend only on interfaces and not actual declarations by using the `@nyx-discord/core` package.

### Feature execution interception

* Allows for intercepting (cancelling) feature executions (commands, subscribers, schedules and sessions) on two
  different ways:
  * `Middlewares`, which are checked for every feature executed, for example, the `CommandManager`'s `CommandMiddleware`
    is called on every command called. Allows appending your custom ones.
  * A `Filter`, which is provided and checked once a specific object is called, for example, when your `UserInfoCommand`
    is called.

### Other

* Flexible error handling for each feature.
* Support for multiple bots running at the same time.
  * 🚧 The framework only includes support for building multiple bots. Whether you'd like some kind of structure for
    managing each of these bots is up to you.

## 🌐 License

nyx is licensed under the [MIT License](https://github.com/Amgelo563/nyx/blob/main/LICENSE).

If you don't understand it or don't want to bother reading it all, here's what you need to know:

* **✅ You can:** Modify the software for your personal or public usage, distribute it freely or commercially.

* **❌ You can't:** Change the license, though you can include it inside a proyect with a more restrictive license, but
  the original code stays licensed under MIT.

* **📝 You need:** To include the copyright (`LICENSE` file) inside the modified code.

You don't need to explicitly give credit to this repository (all the credit is inside `LICENSE` already), but I'll be
grateful if you do so 💙.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnyx-discord%2Fnyx.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnyx-discord%2Fnyx?ref=badge_large)

## 🚧 Disclaimers

* Built-in DB related objects are not included. This is mostly due to compatibility reasons, since there's no easy way
  to make a structure for handling databases that fits every developers and databases' needs, allowing the flexibility
  that nyx aims for.

  You're welcome to open an issue or a PR if you have an idea on how to tackle this issue, but for now, making an
  external object, using declaration merging, or making a plugin for it is advised.
* There are no plans for built-in message command support. There are many reasons including the reasonable lack of
  support from Discord, difficult way to parse them into convenient objects like the `CommandInteractionOptionResolver`,
  among others.

  If you need it, you're welcome to add it by making an external object, using declaration merging, or making a plugin
  for it.