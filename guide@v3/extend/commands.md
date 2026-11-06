# Command Internals (https://nyx-discord.github.io/nyx/guide@v3/extend/commands)

The commands system is made up of several components that work together to store, resolve, execute commands and more.

## Command system components [#command-system-components]

Specifically, these components are:

- [`CommandManager`](/extend/commands/command-manager): The entry point for the command system, holding all the command-related objects and methods that use all of these objects. All objects below are contained here.
- [`CommandResolver`](/extend/commands/command-resolver): Resolves the command that a given command interaction refers to.
- [`CommandExecutor`](/extend/commands/executor): Executes commands, checking its `MiddlewareList` and passing errors to the `ErrorHandler`.
- [`CommandRepository`](/extend/commands/command-repository): Stores all the currently registered commands.
- [`CommandCustomIdCodec`](/extend/commands/command-customidcodec): De/serializes commands names to/from customId strings, for the [Command Components](/use/commands/components) feature.
- [`CommandDeployer`](/extend/commands/command-deployer): Deploys commands to Discord and stores the [ApplicationCommand](https://discord.js.org/docs/packages/discord.js/stable/ApplicationCommand:Class) mappings.
- [`Command EventBus`](/extend/commands/command-bus): An [`EventBus`](../events/event-bus) that emits command related events.
- [`CommandSubscriptionsContainer`](/extend/commands/command-subscriptions-container): Stores the subscribers that are subscribed to the client's `EventBus` to listen for command interactions.

## Execution Sequence [#execution-sequence]

The following diagrams show the flow of a command execution. You can check the guide of each component to see exactly how it works, or how to replace it.

<Callout title="Diagram usage">
- You can zoom and drag on the diagrams.
- A dashed step means it's executed through a non awaited (but caught) Promise, so the next one is inmediately executed if there's an I/O operation in the step.
- You can hover over steps with `(?)` to see extra details.
- If a step goes to a target, and that target doesn't continue the flow, then it's an immediate return, like a getter call.
</Callout>

<Steps>
<Step>
### Command event [#command-event]

For a command to be executed, you first receive a `interactionCreate` event, which is then passed to the [`CommandManager`](./command-manager.mdx):

<CommandEventDiagram />

</Step>
<Step>
### Command resolution [#command-resolution]

The [`CommandResolver`](./command-resolver.mdx) then resolves the command that the interaction refers to. For component interactions, this first needs an intermediate step through the [`CommandCustomIdCodec`](./command-customid-codec.mdx) to deserialize the customId.

#### Command Interactions [#command-interactions]

<CommandResolutionDiagram />

#### Component Interactions [#component-interactions]

<CommandComponentResolutionDiagram />

</Step>

<Step>
### Command execution [#command-execution]

Once the command is resolved, it's passed to the [`CommandExecutor`](./command-executor.mdx):

<CommandExecutionDiagram />

On which the execution ends.

</Step>
</Steps>

Next, see the documentation of each component, where you'll find what it does and how to replace it.
