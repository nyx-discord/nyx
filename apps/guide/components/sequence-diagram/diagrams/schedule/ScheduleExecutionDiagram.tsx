import type { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import type { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';
import ScheduleActors from './ScheduleActors';

type Actors = 'adapter' | 'executor' | 'middleware' | 'errorHandler';

export default function ScheduleExecutionDiagram() {
  const actors: Actor<Actors>[] = [
    ScheduleActors.Adapter,
    ScheduleActors.Executor,
    ScheduleActors.Middleware,
    ScheduleActors.ErrorHandler,
  ];

  const events: Workflow<Actors> = [
    {
      label: 'Wait for scheduled time',
      from: 'adapter',
      to: 'adapter',
      tooltip: 'The job adapter owns the underlying timer/job implementation.',
    },
    {
      from: 'adapter',
      to: 'executor',
      label: 'Invoke execution',
    },
    {
      from: 'executor',
      to: 'middleware',
      label: 'Check middleware list',
      tooltip: 'If there are middlewares registered.',
      offset: -1,
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
      tooltip: 'Execution stops if a middleware denies the tick.',
      offset: -1,
    },
    {
      from: 'executor',
      to: 'executor',
      label: 'Run schedule.tick()',
    },
    {
      from: 'executor',
      to: 'errorHandler',
      label: 'Pass thrown errors, if any',
      tooltip: 'Execution stops if the tick throws.',
      animated: true,
    },
    {
      from: 'executor',
      to: 'adapter',
      label: 'Finish execution',
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="schedule-execution"
      height="45vh"
    />
  );
}


