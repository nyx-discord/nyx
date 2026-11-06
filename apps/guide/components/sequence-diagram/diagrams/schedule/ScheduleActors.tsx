import Link from 'next/link';
import type { Actor } from 'components/sequence-diagram/src/actor/Actor';

export default {
  Manager: {
    label: (
      <p>
        {'⏰ '}
        <Link href="/extend/schedules/schedule-manager">
          <code>ScheduleManager</code>
        </Link>
      </p>
    ),
    color: '#EF476F',
    id: 'manager',
  },
  Repository: {
    label: (
      <p>
        {'🗂️ '}
        <Link href="/extend/schedules/schedule-repository">
          <code>ScheduleRepository</code>
        </Link>
      </p>
    ),
    color: '#ff9f1c',
    id: 'repository',
  },
  Scheduler: {
    label: (
      <p>
        {'📅 '}
        <Link href="/extend/schedules/schedule-execution-scheduler">
          <code>ScheduleExecutionScheduler</code>
        </Link>
      </p>
    ),
    color: '#118ab2',
    id: 'scheduler',
  },
  Adapter: {
    label: (
      <p>
        {'🧩 '}
        <Link href="/extend/schedules/schedule-job-adapter">
          <code>ScheduleJobAdapter</code>
        </Link>
      </p>
    ),
    color: '#f7d7c4',
    id: 'adapter',
  },
  Executor: {
    label: (
      <p>
        {'⚡ '}
        <Link href="/extend/schedules/schedule-executor">
          <code>ScheduleExecutor</code>
        </Link>
      </p>
    ),
    color: { dark: '#FFD166', light: '#ffba1a' },
    id: 'executor',
  },
  Middleware: {
    label: (
      <p>
        {'🛡️ '}
        <Link href="/extend/schedules/schedule-executor/schedule-middleware-list">
          <code>ScheduleMiddlewareList</code>
        </Link>
      </p>
    ),
    color: '#6a994e',
    id: 'middleware',
  },
  ErrorHandler: {
    label: (
      <p>
        {'💫 '}
        <Link href="/extend/schedules/schedule-executor/schedule-error-handler">
          <code>ScheduleErrorHandler</code>
        </Link>
      </p>
    ),
    color: '#92162D',
    id: 'errorHandler',
  },
  Bus: {
    label: (
      <p>
        {'🚌 '}
        <Link href="/extend/events/event-bus">
          Schedule <code>EventBus</code>
        </Link>
      </p>
    ),
    color: '#F78C6B',
    id: 'bus',
  },
} as const satisfies Record<string, Actor<string>>;
