import { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';
import { EventActors } from '../event/EventActors';
import { GlobalActors } from '../GlobalActors';
import { CommandActors } from './CommandActors';

type Actors = 'client' | 'clientBus' | 'intSubscriber' | 'manager';

export default function CommandEventDiagram() {
  const actors: Actor<Actors>[] = [
    GlobalActors.Client,
    EventActors.ClientBus,
    CommandActors.InteractionSubscriber,
    CommandActors.Manager,
  ];

  const events: Workflow<Actors> = [
    {
      from: 'client',
      to: 'clientBus',
      label: <code>interactionCreate</code>,
    },
    {
      from: 'clientBus',
      to: 'intSubscriber',
      label: 'Call subscribers',
    },
    {
      from: 'intSubscriber',
      to: 'manager',
      label: 'Pass interaction',
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="command-event"
      height="45vh"
      defaultViewport={{ x: -160, y: 30, zoom: 0.67 }}
    />
  );
}
