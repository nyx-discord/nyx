import { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';
import { CommandActors } from './CommandActors';

type Actors = 'manager' | 'resolver' | 'repository';

export default function CommandResolutionDiagram() {
  const actors: Actor<Actors>[] = [
    CommandActors.Manager,
    CommandActors.Resolver,
    CommandActors.Repository,
  ];

  const events: Workflow<Actors> = [
    {
      from: 'manager',
      to: 'resolver',
      label: 'Search executable command',
      offset: -1,
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
      offset: -1,
      tooltip: 'Workflow ends if not found',
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="command-resolution"
      height="45vh"
    />
  );
}
