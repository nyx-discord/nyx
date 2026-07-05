import type { Actor } from 'components/sequence-diagram/src/actor/Actor';
import { SequenceDiagram } from 'components/sequence-diagram/src/SequenceDiagram';
import type { Workflow } from 'components/sequence-diagram/src/workflow/Workflow';
import ScheduleActors from './ScheduleActors';

type Actors = 'manager' | 'repository' | 'scheduler' | 'adapter' | 'bus';

export default function ScheduleRegistrationDiagram() {
  const actors: Actor<Actors>[] = [
    ScheduleActors.Manager,
    ScheduleActors.Repository,
    ScheduleActors.Scheduler,
    ScheduleActors.Adapter,
    ScheduleActors.Bus,
  ];

  const events: Workflow<Actors> = [
    {
      from: 'manager',
      to: 'repository',
      label: 'Add schedule to repository',
      tooltip: 'Fails if a schedule with the same ID already exists.',
    },
    {
      from: 'manager',
      to: 'scheduler',
      label: 'Start schedule runtime',
      tooltip:
        'Creates a job adapter so the schedule can be triggered at the right time.',
    },
    {
      from: 'scheduler',
      to: 'adapter',
      label: 'Create job adapter',
    },
    {
      from: 'adapter',
      to: 'manager',
      label: 'Return new job adapter',
    },
    {
      from: 'manager',
      to: 'bus',
      label: (
        <p>
          Emit <code>ScheduleEventEnum.ScheduleAdd</code>
        </p>
      ),
      tooltip: 'Emitted asynchronously after the schedule is registered.',
      offset: -5,
    },
  ];

  return (
    <SequenceDiagram
      actors={actors}
      events={events}
      id="schedule-registration"
      height="45vh"
    />
  );
}


