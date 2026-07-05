import type { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import type { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';

type Actors = 'dispatcher' | 'middlewareList';

export default function EventOverviewDiagram() {
  const actors: Actor<Actors>[] = [
    {
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
    {
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
  ];

  const events: Workflow<Actors> = [
    {
      from: 'dispatcher',
      to: 'middlewareList',
      label: 'Check middleware list',
      tooltip: 'Only if there are middlewares registered',
    },
    {
      from: 'middlewareList',
      to: 'middlewareList',
      label: 'Check all registered middlewares',
    },
    {
      from: 'middlewareList',
      to: 'dispatcher',
      label: 'Return allowed or denied',
      tooltip: 'Workflow ends if denied',
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="event-overview"
      height="45vh"
      defaultViewport={{ x: -170, y: 30, zoom: 0.8 }}
    />
  );
}
