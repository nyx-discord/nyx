import type { Actor } from 'components/sequence-diagram/src/actor/Actor';

export const CommandActors = {
  Manager: {
    label: (
      <p>
        {'💼 '}
        <a href="/extend/commands/command-manager">
          <code>CommandManager</code>
        </a>
      </p>
    ),
    color: '#EF476F',
    id: 'manager',
  },
  CustomId: {
    label: (
      <p>
        {'🔑 '}
        <a href="/extend/commands/command-customidcodec">
          <code>CommandCustomIdCodec</code>
        </a>
      </p>
    ),
    color: '#0CB0A9',
    id: 'customId',
  },
  Resolver: {
    label: (
      <p>
        {'🔎 '}
        <a href="/extend/commands/command-resolver">
          <code>CommandResolver</code>
        </a>
      </p>
    ),
    color: '#0CB0A9',
    id: 'resolver',
  },
  Repository: {
    label: (
      <p>
        {'🗂️ '}
        <a href="/extend/commands/command-repository">
          <code>CommandRepository</code>
        </a>
      </p>
    ),
    color: '#ff9f1c',
    id: 'repository',
  },
  Executor: {
    label: (
      <p>
        {'⚡ '}
        <a href="/extend/commands/executor">
          <code>CommandExecutor</code>
        </a>
      </p>
    ),
    color: { dark: '#FFD166', light: '#ffba1a' },
    id: 'executor',
  },
  Middleware: {
    label: (
      <p>
        {'🛡️ '}
        <a href="/extend/commands/executor/command-middleware-list">
          <code>MiddlewareList</code>
        </a>
      </p>
    ),
    color: '#6a994e',
    id: 'middleware',
  },
  ErrorHandler: {
    label: (
      <p>
        {'💫 '}
        <a href="/extend/commands/executor/command-error-handler">
          <code>ErrorHandler</code>
        </a>
      </p>
    ),
    color: '#92162D',
    id: 'errorHandler',
  },
  InteractionSubscriber: {
    label: (
      <p>
        {'👂 '}
        <a href="/extend/commands/command-subscriptions-container">
          <code>CommandInteractionSubscriber</code>
        </a>
      </p>
    ),
    color: '#0f83a9',
    id: 'intSubscriber',
  },
  Bus: {
    label: (
      <p>
        {'🚌 '}
        <a href="/extend/commands/command-bus">
          Command <code>EventBus</code>
        </a>
      </p>
    ),
    color: '#F78C6B',
    id: 'cmdBus',
  },
} as const satisfies Record<string, Actor<string>>;
