import { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';
import { CommandActors } from './CommandActors';

type Actors = 'manager' | 'resolver' | 'repository' | 'customId';

export default function CommandComponentResolutionDiagram() {
  const actors: Actor<Actors>[] = [
    CommandActors.Manager,
    CommandActors.CustomId,
    CommandActors.Resolver,
    CommandActors.Repository,
  ];

  const events: Workflow<Actors> = [
    {
      from: 'manager',
      to: 'customId',
      label: (
        <p style={{ fontSize: '0.9em' }}>
          Deserialize <code style={{ fontSize: '0.9em' }}>customId</code>
        </p>
      ),
      offset: -6,
    },
    {
      from: 'manager',
      to: 'resolver',
      label: (
        <p>
          Search command using <code>customId</code> data
        </p>
      ),
    },
    {
      from: 'resolver',
      to: 'repository',
      label: 'Get commands',
    },
    {
      from: 'resolver',
      to: 'resolver',
      label: 'Search in commands from repository',
    },
    {
      from: 'resolver',
      to: 'manager',
      label: 'Return found command, if any',
      tooltip: 'Workflow ends if not found',
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="command-component-resolution"
      height="45vh"
    />
  );
}
