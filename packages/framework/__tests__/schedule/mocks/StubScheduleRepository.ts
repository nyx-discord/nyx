import type { Identifier, ScheduleRepository } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubScheduleRepository {
  public static create(
    overrides?: Partial<{ size: number }>,
  ): ScheduleRepository {
    let schedules: Map<Identifier, unknown> = new Map();

    return {
      get size() {
        return overrides?.size ?? schedules.size;
      },
      addSchedule: vi.fn().mockImplementation(function (
        this: typeof stub,
        schedule: { getId: () => Identifier },
      ) {
        schedules.set(schedule.getId(), schedule);
        return this;
      }),
      removeSchedule: vi.fn().mockImplementation(function (this: typeof stub) {
        return this;
      }),
      getScheduleByID: vi
        .fn()
        .mockImplementation((id: Identifier) => schedules.get(id) ?? null),
      getScheduleByClass: vi.fn().mockReturnValue(null),
      has: vi.fn().mockImplementation((id: Identifier) => schedules.has(id)),
      getSchedules: vi.fn().mockReturnValue(new Map()),
      values: vi.fn(function* () {}),
      keys: vi.fn(function* () {}),
      entries: vi.fn(function* () {}),
      next: vi.fn().mockReturnValue({ done: true, value: undefined }),
      onStart: vi.fn(),
      onStop: vi.fn(),
      [Symbol.iterator]: vi.fn(function* () {}),
    } as unknown as ScheduleRepository & ReturnType<typeof stub>;
  }
}
