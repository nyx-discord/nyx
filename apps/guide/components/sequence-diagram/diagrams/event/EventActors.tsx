import Link from 'next/link';
import { Actor } from 'components/sequence-diagram/src/actor/Actor';

export const EventActors = {
  Emitter: {
    label: '👤 Object',
    color: '#ff595e',
    id: 'emitter',
  },
  Bus: {
    label: (
      <p>
        {'🚌 '}
        <Link href="/use/events/buses">
          <code>EventBus</code>
        </Link>
      </p>
    ),
    color: '#ff924c',
    id: 'bus',
  },
  Dispatcher: {
    label: (
      <p>
        {'⚡ '}
        <Link href="/extend/events/dispatcher">
          <code>EventDispatcher</code>
        </Link>
      </p>
    ),
    color: '#ffca3a',
    id: 'dispatcher',
  },
  MiddlewareList: {
    label: (
      <p>
        {'️🛡️  '}
        <Link href="/use/events/middlewares">
          <code>MiddlewareList</code>
        </Link>
      </p>
    ),
    color: '#8ac926',
    id: 'middlewareList',
  },
  Subscriber: {
    label: (
      <p>
        {'👂 '}
        <Link href="/use/events/subscribers">
          <code>EventSubscriber</code>
        </Link>
      </p>
    ),
    color: {
      dark: '#1982c4',
      light: '#038866',
    },
    id: 'subscriber',
  },
  ErrorHandler: {
    label: (
      <p>
        {'💫 '}
        <Link href="/use/other/error-handling">
          <code>ErrorHandler</code>
        </Link>
      </p>
    ),
    color: '#92162D',
    id: 'errorHandler',
  },
  ClientBus: {
    label: (
      <p>
        Client <code>EventBus</code>
      </p>
    ),
    color: '#F78C6B',
    id: 'clientBus',
  },
} as const satisfies Record<string, Actor<string>>;
