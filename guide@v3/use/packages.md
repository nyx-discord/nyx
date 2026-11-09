# Packages (https://nyx-discord.github.io/nyx/guide@v3/use/packages)

## Which package do I need? [#which-package-do-i-need]

You only need to install **one**: the adapter that matches how your bot connects to Discord.

| If your bot...                                                                                    | Install                 |
|---------------------------------------------------------------------------------------------------|-------------------------|
| Uses [discord.js](https://discord.js.org)                                                         | `@nyx-discord/djs`      |
| Uses [@discordjs/core](https://discord.js.org/docs/packages/core/main)                            | `@nyx-discord/djs-core` |
| Only handles HTTP payloads instead of the gateway (e.g. on a serverless platform)                 | `@nyx-discord/http`     |

Under the hood, every adapter is built over `@nyx-discord/base`, which has the interfaces every component follows,
plus some default implementations of them. The adapters add the missing parts that connect to your Discord library.

Every component depends on interfaces rather than on the default implementations, so you can replace any of them with
your own. You can later check the [Extend](/extend) section for how.

## Interfaces and implementations [#interfaces-and-implementations]

`@nyx-discord/base` contains two kinds of objects, which you can tell apart by their names.

**Interfaces** have no prefix, like <DocsLink pkg='base' name='SubCommand' decorated={false} label={<code>SubCommand</code>} /> or <DocsLink pkg='base' name='CommandManager' decorated={false} label={<code>CommandManager</code>} />. They describe what a component does, and are what the rest of the framework expects.

**Implementations** have a prefix that tells you how to use them:

| Prefix     | Meaning                                                                                                     | Example                                                                                                                       |
|------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `Abstract` | Needs to be extended to be used. You'll extend these to create your own commands, subscribers, schedules, etc. | <DocsLink pkg='base' name='AbstractSchedule' decorated={false} label={<code>AbstractSchedule</code>} />                       |
| `Basic`    | A complete, simple implementation. Use it directly, or extend it to customize it.                           | <DocsLink pkg='base' name='BasicEventBus' decorated={false} label={<code>BasicEventBus</code>} />                             |
| `Default`  | The implementation the bot uses internally. To customize it, extend it and [inject your version](/extend).  | <DocsLink pkg='base' name='DefaultCommandManager' decorated={false} label={<code>DefaultCommandManager</code>} />           |
| `Base`     | A Discord-library-agnostic foundation that the adapters build on. You won't use these directly.         | <DocsLink pkg='base' name='BaseCommand' decorated={false} label={<code>BaseCommand</code>} />                                 |

For example, your adapter's <DocsLink pkg='djs' name='AbstractStandaloneCommand' decorated={false} label={<code>AbstractStandaloneCommand</code>} /> builds on <DocsLink pkg='base' name='BaseStandaloneCommand' decorated={false} label={<code>BaseStandaloneCommand</code>} />, adding the types of your Discord library. Extend the adapter's version, not the `Base` one.

When you want to specify a type, prefer the interfaces, e.g. `consume(cmd: SubCommand)` instead
of `consume(cmd: AbstractSubCommand)`. That way your code works with any implementation, following
[Dependency inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle).

## Building something for nyx [#building-something-for-nyx]

If you're developing something for nyx itself, such as a plugin, you can depend on `@nyx-discord/base` instead of an
adapter, so your component works across all of them.

`@nyx-discord/base` also lets you import each kind of object separately:

| Import                       | Contains                     |
|------------------------------|------------------------------|
| `@nyx-discord/base`          | Everything.                  |
| `@nyx-discord/base/types`    | Only the interfaces.         |
| `@nyx-discord/base/defaults` | Only the implementations.    |

Importing your types from `@nyx-discord/base/types` makes it impossible to accidentally depend on an implementation.
