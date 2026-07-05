import type { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import type { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';

type Actors = 'dispatcher' | 'subscriber' | 'errorHandler';

export default function EventSubscriberDispatchDiagram() {
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
    {
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
  ];

  const events: Workflow<Actors> = [
    {
      from: 'dispatcher',
      to: 'subscriber',
      label: 'Notify subscriber',
      animated: true,
    },
    {
      from: 'dispatcher',
      to: 'errorHandler',
      label: 'Pass thrown errors, if any',
      tooltip: 'Workflow ends if it errored',
      animated: true,
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="event-subscriber-dispatch"
      height="45vh"
      defaultViewport={{ x: -120, y: 10, zoom: 0.63 }}
    />
  );
}
