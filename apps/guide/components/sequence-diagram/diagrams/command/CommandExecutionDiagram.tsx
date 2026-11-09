import { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';
import { CommandActors } from './CommandActors';

type Actors = 'manager' | 'executor' | 'middleware' | 'errorHandler' | 'cmdBus';

export default function CommandExecutionDiagram() {
  const actors: Actor<Actors>[] = [
    CommandActors.Manager,
    CommandActors.Executor,
    CommandActors.Middleware,
    CommandActors.ErrorHandler,
    CommandActors.Bus,
  ];

  const events: Workflow<Actors> = [
    {
      from: 'manager',
      to: 'executor',
      label: 'Execute command',
    },
    {
      from: 'executor',
      to: 'middleware',
      label: 'Check middleware list',
      offset: -1,
      tooltip: 'If there are middlewares registered',
    },
    {
      from: 'middleware',
      to: 'middleware',
      label: 'Check all registered middlewares',
    },
    {
      from: 'middleware',
      to: 'executor',
      label: 'Return allowed or denied',
      tooltip: 'Workflow ends if denied',
      offset: -1,
    },
    {
      from: 'executor',
      to: 'executor',
      label: 'Execute command',
      animated: true,
    },
    {
      from: 'executor',
      to: 'errorHandler',
      label: 'Pass thrown errors, if any',
      tooltip: 'Workflow ends if it errored',
      animated: true,
    },
    {
      from: 'executor',
      to: 'manager',
      label: 'Finish execution',
    },
    {
      from: 'manager',
      to: 'cmdBus',
      label: (
        <p>
          Emit <code>CommandEventEnum.CommandRun</code>
        </p>
      ),
      offset: -8.5,
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="command-execution"
      height="45vh"
    />
  );
}
