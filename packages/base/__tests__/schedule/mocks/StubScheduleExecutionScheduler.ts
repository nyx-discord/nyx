import type {
  Identifier,
  ScheduleExecutionScheduler,
  ScheduleJobAdapter,
} from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubScheduleExecutionScheduler {
  public static create(): ScheduleExecutionScheduler & {
    jobs: Map<Identifier, unknown>;
  } {
    const jobs = new Map<Identifier, unknown>();
    return {
      jobs,
      start: vi
        .fn()
        .mockImplementation((schedule: { getId: () => Identifier }) => {
          const adapter = StubScheduleJobAdapter.create();
          jobs.set(schedule.getId(), adapter);
          return adapter;
        }),
      pause: vi.fn(),
      destroy: vi.fn(),
      getJobs: vi.fn().mockReturnValue(new Map()),
      getJobForSchedule: vi.fn().mockImplementation((scheduleOrId: unknown) => {
        const id =
          typeof scheduleOrId === 'symbol'
            ? scheduleOrId
            : (scheduleOrId as { getId: () => Identifier }).getId();
        return jobs.get(id) ?? null;
      }),
      onStart: vi.fn(),
      onStop: vi.fn(),
    } as unknown as ScheduleExecutionScheduler & {
      jobs: Map<Identifier, unknown>;
    };
  }
}

export class StubScheduleJobAdapter {
  public static create(): ScheduleJobAdapter<unknown> {
    return {
      pause: vi.fn().mockResolvedValue(undefined),
      resume: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      getInterval: vi.fn(),
      isRunning: vi.fn().mockReturnValue(true),
      getRaw: vi.fn(),
    } as unknown as ScheduleJobAdapter<unknown>;
  }
}
