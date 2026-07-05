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
        <a href="/use/events/buses">
          <code>EventBus</code>
        </a>
      </p>
    ),
    color: '#ff924c',
    id: 'bus',
  },
  Dispatcher: {
    label: (
      <p>
        {'⚡ '}
        <a href="/extend/events/dispatcher">
          <code>EventDispatcher</code>
        </a>
      </p>
    ),
    color: '#ffca3a',
    id: 'dispatcher',
  },
  MiddlewareList: {
    label: (
      <p>
        {'️🛡️  '}
        <a href="/use/events/middlewares">
          <code>MiddlewareList</code>
        </a>
      </p>
    ),
    color: '#8ac926',
    id: 'middlewareList',
  },
  Subscriber: {
    label: (
      <p>
        {'👂 '}
        <a href="/use/events/subscribers">
          <code>EventSubscriber</code>
        </a>
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
        <a href="/use/other/error-handling">
          <code>ErrorHandler</code>
        </a>
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
