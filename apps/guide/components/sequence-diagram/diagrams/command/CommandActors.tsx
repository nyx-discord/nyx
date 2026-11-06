import Link from 'next/link';
import type { Actor } from 'components/sequence-diagram/src/actor/Actor';

export const CommandActors = {
  Manager: {
    label: (
      <p>
        {'💼 '}
        <Link href="/extend/commands/command-manager">
          <code>CommandManager</code>
        </Link>
      </p>
    ),
    color: '#EF476F',
    id: 'manager',
  },
  CustomId: {
    label: (
      <p>
        {'🔑 '}
        <Link href="/extend/commands/command-customidcodec">
          <code>CommandCustomIdCodec</code>
        </Link>
      </p>
    ),
    color: '#0CB0A9',
    id: 'customId',
  },
  Resolver: {
    label: (
      <p>
        {'🔎 '}
        <Link href="/extend/commands/command-resolver">
          <code>CommandResolver</code>
        </Link>
      </p>
    ),
    color: '#0CB0A9',
    id: 'resolver',
  },
  Repository: {
    label: (
      <p>
        {'🗂️ '}
        <Link href="/extend/commands/command-repository">
          <code>CommandRepository</code>
        </Link>
      </p>
    ),
    color: '#ff9f1c',
    id: 'repository',
  },
  Executor: {
    label: (
      <p>
        {'⚡ '}
        <Link href="/extend/commands/executor">
          <code>CommandExecutor</code>
        </Link>
      </p>
    ),
    color: { dark: '#FFD166', light: '#ffba1a' },
    id: 'executor',
  },
  Middleware: {
    label: (
      <p>
        {'🛡️ '}
        <Link href="/extend/commands/executor/command-middleware-list">
          <code>MiddlewareList</code>
        </Link>
      </p>
    ),
    color: '#6a994e',
    id: 'middleware',
  },
  ErrorHandler: {
    label: (
      <p>
        {'💫 '}
        <Link href="/extend/commands/executor/command-error-handler">
          <code>ErrorHandler</code>
        </Link>
      </p>
    ),
    color: '#92162D',
    id: 'errorHandler',
  },
  InteractionSubscriber: {
    label: (
      <p>
        {'👂 '}
        <Link href="/extend/commands/command-subscriptions-container">
          <code>CommandInteractionSubscriber</code>
        </Link>
      </p>
    ),
    color: '#0f83a9',
    id: 'intSubscriber',
  },
  Bus: {
    label: (
      <p>
        {'🚌 '}
        <Link href="/extend/commands/command-bus">
          Command <code>EventBus</code>
        </Link>
      </p>
    ),
    color: '#F78C6B',
    id: 'cmdBus',
  },
} as const satisfies Record<string, Actor<string>>;
