---
name: nyx
description: Build and modify Discord bots with the nyx framework (@nyx-discord/djs, @nyx-discord/djs-core, @nyx-discord/base, @nyx-discord/loaders, @nyx-discord/plugin-sessions). Use when a project depends on any @nyx-discord package, or the user asks to create a Discord bot with nyx, add slash/context menu commands, subcommands, buttons/select menus/modals, event subscribers, schedules, filters, middlewares, plugins or sessions, or to search the nyx docs.
---

# nyx

nyx is an interface-first TypeScript framework for Discord bots. It handles application commands, events, schedules and plugins on top of discord.js (`@nyx-discord/djs`) or @discordjs/core (`@nyx-discord/djs-core`). It's a thin presentation layer: it doesn't own the process, storage or error reporting. Those stay in the user's code.

## Before writing code

1. **Find the adapter.** Check `package.json`: `@nyx-discord/djs` means discord.js, `@nyx-discord/djs-core` means @discordjs/core. Import everything from that one package: it re-exports `@nyx-discord/base`. Only use `@nyx-discord/base` directly when writing an adapter-agnostic plugin.
2. **Copy the closest example** from `examples/djs/` or `examples/djs-core/` (table below). They're typechecked against the real packages.
3. **Check the docs page before using an API you haven't seen** in the examples. Don't guess from discord.js habits or other frameworks (Sapphire, discordx, Necord...): nyx's APIs differ.

## Docs

The guide is published as Markdown for agents:

- Index of every page: https://nyx-discord.github.io/nyx/guide/llms.txt
- Any page as Markdown: `https://nyx-discord.github.io/nyx/guide/<path>.md`, e.g. `use/commands/components.md`
- Everything in one file (large, prefer single pages): https://nyx-discord.github.io/nyx/guide/llms-full.txt
- API reference (TypeDoc): https://nyx-discord.github.io/nyx/typedoc/

Useful pages: `use/first-start`, `use/commands`, `use/commands/types/standalone`, `use/commands/types/parent`, `use/commands/types/parent/subcommand`, `use/commands/types/context-menu`, `use/commands/components`, `use/commands/filters`, `use/commands/middlewares`, `use/events`, `use/events/subscribers`, `use/events/buses`, `use/schedules`, `use/plugins`, `use/other/error-handling`, `use/other/metadata`, `loaders`, `loaders/commands`, `session`, `extend` (replacing internals).

Code blocks in the Markdown pages contain twoslash directives (`// ---cut---`, `// @ts-expect-error`, `// ^?`). Ignore those lines and any `declare const` stubs. Pages show both adapters in `<Tab>` blocks: use the one matching the project.

## Examples

| Task | discord.js | @discordjs/core |
| --- | --- | --- |
| Create, register and start a bot | `examples/djs/bot.ts` | `examples/djs-core/bot.ts` |
| Error handling, typing a bot parameter | `examples/djs/error-handling.ts` | same API, with `CoreNyxBot` |
| Slash command, options, autocomplete, guild-only deploy | `examples/djs/standalone-command.ts` | `examples/djs-core/standalone-command.ts` |
| Parent command with subcommands and groups | `examples/djs/parent-command.ts` | same as discord.js, with API objects as `data` |
| User/message context menu | `examples/djs/context-menu-command.ts` | same as discord.js, with API objects as `data` |
| Buttons/selects/modals handled by the command | `examples/djs/command-components.ts` | `examples/djs-core/command-components.ts` |
| Filters and middlewares | `examples/djs/filter-and-middleware.ts` | `examples/djs-core/filter.ts` |
| Client event subscribers, custom event buses | `examples/djs/client-subscriber.ts` | `examples/djs-core/client-subscriber.ts` |
| Schedules (cron, interval, date) | `examples/djs/schedule.ts` | `examples/djs-core/schedule.ts` |
| Plugins | `examples/djs/plugin.ts` | same API |
| Loading commands/events/schedules from folders | `examples/djs/bot-with-loaders.ts` | same API |
| Session: multi-interaction flow with buttons, select, modal, TTL and a result | `examples/djs/sessions/counter-session.ts` | `examples/djs-core/sessions/counter-session.ts` |
| Paginated list | `examples/djs/sessions/list-pagination-session.ts` | same API, from `/djs-core` |
| Multi-step wizard (stages) | `examples/djs/sessions/wizard-session.ts` | same API, from `/djs-core` |

## Rules

**Bot**
- Create bots with `Bot.create(() => ({ token, client, logger, deployCommands }))`. It fills in every default manager. `new Bot(...)` needs every manager passed in, so only use it when replacing most of them.
- With djs-core, `client` is `new CoreNyxClient(client, gateway, applicationId)`. With djs, pass the discord.js `Client` directly. Either way, don't log the client in yourself: `bot.start()` does it.
- Add commands, subscribers and schedules before `bot.start()`, so commands deploy in one batch. A bot whose `start()` rejects is dead: create a new one.
- There's no global state. Executed objects get their bot from the execution meta, so one instance works across several bots.

**Commands**
- Extend `AbstractStandaloneCommand`, `AbstractParentCommand` + `AbstractSubCommand`/`AbstractSubCommandGroup`, or `AbstractContextMenuCommand`. Declare `protected readonly data` as the raw API JSON (discord.js: builder + `.toJSON()`; djs-core: an object annotated with the `RESTPostAPI...JSONBody` type) and implement `execute(interaction, meta)` (context menus: `executeUser` / `executeMessage`).
- A parent's `data` has no options. Children are added with `addChildren(new Child(this))`, and subcommands/groups receive their parent in the constructor.
- Register with `await bot.getCommandManager().addCommands(...)`. Deploy with `deployCommands: true`, or call `bot.getCommandManager().deploy()` once.
- Override `getGuilds()` to deploy to specific guilds, and `autocomplete()` for autocomplete options.
- Component customIds come from `this.buildCustomId(bot, extra?)`. Clicks arrive in the `protected` methods `handleButton` / `handleSelectMenu` / `handleModal`, and the extra string is in `TypedFields.CustomIdExtra.get(meta, true)`. To pack objects into the extra, use `@sapphire/string-store`. For components that don't come from a command, use an `interactionCreate` subscriber.
- Only application commands are supported. Don't build prefix/message commands.

**Typing**
- Inside executed objects, get the adapter-typed bot with `TypedFields.DjsBot` (djs) or `TypedFields.CoreBot` (djs-core). `TypedFields.Bot` is the adapter-agnostic `NyxBot`, so its client is untyped.
- Parameterize interaction-generic types with the adapter: `CommandFilterResolvable<DjsInteractionTypes>`, `CommandResolvableInteraction<CoreInteractionTypes>`, `CommandLoader.load<DjsInteractionTypes>(...)`.
- Type functions and fields that receive a bot as `DjsNyxBot` (djs) or `CoreNyxBot` (djs-core), which is what `Bot.create()` returns. A bare `NyxBot` loses the adapter types, and passing a created bot to it fails to typecheck. Use `NyxBot` only in adapter-agnostic code like plugins.
- Use `override` when replacing a concrete member (`filter`, `priority`, `lifetime`, `getGuilds`, `autocomplete`, `handleButton`...).

**Events, schedules, plugins**
- Client events: extend `AbstractDJSClientSubscriber<typeof Events.X>` or `AbstractCoreClientSubscriber<GatewayDispatchEvents.X>`, set `protected readonly event`, and implement `handleEvent(meta, ...args)`. **The meta is the first argument.** Register with `bot.subscribeToClient(...)`.
- Custom events: create a bus with `BasicEventBus.createAsync<Events>()` or `.createSync<Events>()` and subscribe `AbstractEventSubscriber<Events, 'name'>` subclasses to it.
- Schedules: extend `AbstractSchedule`, set `interval` (a cron string, milliseconds, or a `Date`) and implement `tick(meta)`. Schedules live only in memory.
- Plugins implement `NyxPlugin` (`onRegister`, `onUnregister`, `getData`, `getId`) and are registered with `bot.getPluginManager().register(...)`.

**Sessions (`@nyx-discord/plugin-sessions`)**
- Use a session when an interaction flow spans several interactions with state: paginated lists, wizards, settings menus, confirmations. For a single component on a command's reply, command components are enough.
- Import from `@nyx-discord/plugin-sessions/djs` or `/djs-core`, matching the adapter, and register the plugin once: `bot.getPluginManager().register(DjsSessionPlugin.create())` (`CoreSessionPlugin` for djs-core).
- Extend `AbstractSession<Result>`, `AbstractListPaginationSession<Item, Result>`, or `AbstractStagePaginationSession<Result>` with `AbstractSessionStartStage` / `AbstractSessionStage` stages. `onStart()` makes the first reply on `this.startInteraction`, and `onEnd()` runs when the TTL expires.
- Start one with `new MySession({ bot, id, startInteraction }).start()`. The `id` must be short, random and unique among active sessions, because it's embedded in every customId. Await `session.getEndPromise()` to get `{ result }`.
- Every session component needs `this.buildCustomId(extra?)` (from a stage, `this.session.buildCustomId()`), never a hand-written customId. Page buttons come from `buildBasicPageRow()` or `buildPageCustomId(page)`.
- `handleButton` / `handleSelectMenu` / `handleModal` (`handleSelect` in stages), `updatePage` and `onSwitch` return whether to renew the TTL. Return `false` to ignore an interaction, e.g. from another user.
- Sessions live in memory only and end on restart.

**Filters, middlewares, errors**
- Filters (`protected override readonly filter`, a `BaseCommandFilter` or a function) return a boolean. When one returns `false` the command silently doesn't run, so reply inside the filter if the user should be told.
- Middlewares (`BaseCommandMiddleware`, returning `this.true()` / `this.false()`) run before every command. Add them with `bot.getCommandManager().getExecutor().getMiddleware().add(...)`.
- Errors go to the executor's `ErrorHandler`: `getExecutor().getErrorHandler().setConsumer(ErrorClass, fn)` / `.setFallbackConsumer(fn)`. nyx never replies to users on errors, so do it there.

**Design**
- Keep business logic in your own services. Commands should map interactions to service calls and results to replies, so the logic stays testable without Discord.
- Every manager has an interface in `@nyx-discord/base` and a `Default*` implementation. To change internal behavior, inject your own through `Bot.create()` or `X.create()` options (see the `extend` docs) instead of monkey-patching.
- Type parameters and fields with the interfaces (`SubCommand`, `CommandManager`, `ParentCommand`...), not the `Abstract*`/`Default*` classes.
- nyx doesn't ship storage, cooldown stores, i18n or error replies on purpose. Use the user's own.
- `@nyx-discord/loaders` loads compiled `.js` files, so point it at the build output (`./dist/commands`), not at `src`.
