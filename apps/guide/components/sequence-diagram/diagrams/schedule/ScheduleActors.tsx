import type { Actor } from 'components/sequence-diagram/src/actor/Actor';

export default {
  Manager: {
    label: (
      <p>
        {'⏰ '}
        <a href="/extend/schedules/schedule-manager">
          <code>ScheduleManager</code>
        </a>
      </p>
    ),
    color: '#EF476F',
    id: 'manager',
  },
  Repository: {
    label: (
      <p>
        {'🗂️ '}
        <a href="/extend/schedules/schedule-repository">
          <code>ScheduleRepository</code>
        </a>
      </p>
    ),
    color: '#ff9f1c',
    id: 'repository',
  },
  Scheduler: {
    label: (
      <p>
        {'📅 '}
        <a href="/extend/schedules/schedule-execution-scheduler">
          <code>ScheduleExecutionScheduler</code>
        </a>
      </p>
    ),
    color: '#118ab2',
    id: 'scheduler',
  },
  Adapter: {
    label: (
      <p>
        {'🧩 '}
        <a href="/extend/schedules/schedule-job-adapter">
          <code>ScheduleJobAdapter</code>
        </a>
      </p>
    ),
    color: '#f7d7c4',
    id: 'adapter',
  },
  Executor: {
    label: (
      <p>
        {'⚡ '}
        <a href="/extend/schedules/schedule-executor">
          <code>ScheduleExecutor</code>
        </a>
      </p>
    ),
    color: { dark: '#FFD166', light: '#ffba1a' },
    id: 'executor',
  },
  Middleware: {
    label: (
      <p>
        {'🛡️ '}
        <a href="/extend/schedules/schedule-executor/schedule-middleware-list">
          <code>ScheduleMiddlewareList</code>
        </a>
      </p>
    ),
    color: '#6a994e',
    id: 'middleware',
  },
  ErrorHandler: {
    label: (
      <p>
        {'💫 '}
        <a href="/extend/schedules/schedule-executor/schedule-error-handler">
          <code>ScheduleErrorHandler</code>
        </a>
      </p>
    ),
    color: '#92162D',
    id: 'errorHandler',
  },
  Bus: {
    label: (
      <p>
        {'🚌 '}
        <a href="/extend/events/event-bus">
          Schedule <code>EventBus</code>
        </a>
      </p>
    ),
    color: '#F78C6B',
    id: 'bus',
  },
} as const satisfies Record<string, Actor<string>>;
