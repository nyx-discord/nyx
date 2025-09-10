import React from 'react';
import type { Actor } from '../src/actor/Actor';
import { SequenceDiagram } from '../src/SequenceDiagram';
import type { Workflow } from '../src/workflow/Workflow';

type Actors =
  | 'you'
  | 'manager'
  | 'repository'
  | 'scheduler'
  | 'adapter'
  | 'executor'
  | 'middleware'
  | 'errorHandler';

export default function ScheduleOverviewDiagram() {
  const actors: Actor<Actors>[] = [
    {
      label: '👤 You',
      color: '#2a9fd6',
      id: 'you',
    },
    {
      label: (
        <p>
          {'💼 '}
          <a href="./schedule-manager">
            <code>ScheduleManager</code>
          </a>
        </p>
      ),
      color: '#ff595e',
      id: 'manager',
    },
    {
      label: (
        <p>
          {'🚌 '}
          <a href="./schedule-repository">
            <code>ScheduleRepository</code>
          </a>
        </p>
      ),
      color: '#ff924c',
      id: 'repository',
    },
    {
      label: (
        <p>
          {'⏰ '}
          <a href="./schedule-scheduler">
            <code>ScheduleExecutionScheduler</code>
          </a>
        </p>
      ),
      color: '#ffffff',
      id: 'scheduler',
    },
    {
      label: (
        <p>
          {'🧩 '}
          <a href="./schedule-scheduler#-job-adapters">
            <code>ScheduleJobAdapter</code>
          </a>
        </p>
      ),
      color: '#f7d7c4',
      id: 'adapter',
    },
    {
      label: (
        <p>
          {'⚡ '}
          <a href="./schedule-executor">
            <code>ScheduleExecutor</code>
          </a>
        </p>
      ),
      color: { dark: '#FFD166', light: '#ffba1a' },
      id: 'executor',
    },
    {
      label: (
        <p>
          {'️🛡️  '}
          <a href="./schedule-interception#-schedule-middlewares">
            <code>MiddlewareList</code>
          </a>
        </p>
      ),
      color: '#8ac926',
      id: 'middleware',
    },
    {
      label: (
        <p>
          {'💫 '}
          <a href="../error/error-handling">
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
      from: 'you',
      steps: [
        {
          to: 'manager',
          label: 'Add a new schedule',
        },
        {
          to: 'repository',
          label: 'Add schedule to repository',
        },
      ],
    },
    {
      from: 'manager',
      steps: [
        {
          to: 'scheduler',
          label: 'Track schedule',
        },
        {
          to: 'adapter',
          label: 'Instantiate new job adapter for this schedule',
        },
      ],
    },
    {
      from: 'adapter',
      to: 'you',
      label: 'Return new job adapter',
    },
    {
      from: 'adapter',
      to: 'adapter',
      label: 'Wait for scheduled time',
    },
    {
      from: 'adapter',
      steps: [
        {
          to: 'executor',
          label: 'Execute schedule',
        },
        {
          to: 'middleware',
          label: 'Check middleware list',
          tooltip: 'If there are middlewares registered',
        },
      ],
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
    },
    {
      from: 'executor',
      to: 'executor',
      label: 'Tick schedule',
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
      to: 'adapter',
      label: 'Finish execution',
      tooltip: (
        <p>
          Emits <code>ScheduleEventEnum.ScheduleTick</code>
        </p>
      ),
    },
  ];

  return SequenceDiagram({
    actors,
    events,
    id: 'schedule-overview',
    height: '65vh',
  });
}
