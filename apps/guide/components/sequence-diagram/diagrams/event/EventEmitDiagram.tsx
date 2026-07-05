import type { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import type { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';

type Actors = 'emitter' | 'bus' | 'dispatcher';

export default function EventEmitDiagram() {
  const actors: Actor<Actors>[] = [
    {
      label: '👤 Object',
      color: '#ff595e',
      id: 'emitter',
    },
    {
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
  ];

  const events: Workflow<Actors> = [
    {
      from: 'emitter',
      to: 'bus',
      label: 'Emit event',
      animated: true,
    },
    {
      from: 'bus',
      to: 'bus',
      label: 'Get subscribers for event',
      tooltip: 'If none are found, emit returns immediately',
    },
    {
      from: 'bus',
      to: 'bus',
      label: 'Create metadata and dispatch args',
      tooltip: 'Uses generateArgsForEvent + metadataFactory',
    },
    {
      from: 'bus',
      to: 'dispatcher',
      label: 'Pass subscribers and args',
    },
    {
      from: 'dispatcher',
      to: 'bus',
      label: 'Return when dispatch finishes',
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="event-emit"
      height="45vh"
      defaultViewport={{ x: -130, y: 10, zoom: 0.66 }}
    />
  );
}
