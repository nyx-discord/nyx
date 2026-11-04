import type {
  Awaitable,
  ScheduleInterval,
  ScheduleJobAdapter,
} from '@nyx-discord/types';

/** The handle of the timeout a {@link TimerJobAdapter} is currently waiting on. */
export type TimerJobHandle = ReturnType<typeof setTimeout>;

/**
 * A {@link ScheduleJobAdapter} for millisecond schedule intervals
 *
 * Unlike `setInterval`, supports intervals longer than the runtime's maximum timer
 * delay (24 days for Node) and doesn't drift, since each run is scheduled from the
 * previous target rather than from when the callback ran.
 *
 * FIXME: This is a workaround for `croner` not supporting ms intervals. It should be removed if that's supported in the future.
 */
export class TimerJobAdapter implements ScheduleJobAdapter<TimerJobHandle | null> {
  /** The maximum delay `setTimeout` accepts before it fires immediately instead. */
  public static readonly MaxTimeoutMs = 2_147_483_647;

  protected readonly intervalMs: number;

  protected readonly callback: () => Awaitable<void>;

  protected timeout: TimerJobHandle | null = null;

  protected nextRunAt: number | null = null;

  protected destroyed = false;

  /** @throws {RangeError} If the interval is not a finite, positive number. */
  constructor(intervalMs: number, callback: () => Awaitable<void>) {
    if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
      throw new RangeError(
        `Schedule interval must be a finite, positive amount of milliseconds, got ${intervalMs}.`,
      );
    }

    this.intervalMs = intervalMs;
    this.callback = callback;
  }

  public isRunning(): boolean {
    return this.timeout !== null;
  }

  public pause(): this {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = null;
    this.nextRunAt = null;
    return this;
  }

  public resume(): this {
    if (this.destroyed || this.timeout) return this;

    this.nextRunAt = Date.now() + this.intervalMs;
    this.arm();
    return this;
  }

  public destroy(): this {
    this.pause();
    this.destroyed = true;
    return this;
  }

  public getInterval(): ScheduleInterval {
    return this.intervalMs;
  }

  public getRaw(): TimerJobHandle | null {
    return this.timeout;
  }

  public getNextRun(): Date | null {
    return this.nextRunAt === null ? null : new Date(this.nextRunAt);
  }

  protected onTimeout(): void {
    this.timeout = null;
    if (this.nextRunAt === null) return;

    const now = Date.now();
    // a long interval is split into several timeouts; keep waiting until the target
    if (now < this.nextRunAt) {
      this.arm();
      return;
    }

    // schedule the next run from the previous target, skipping any runs that were missed
    const missed = Math.floor((now - this.nextRunAt) / this.intervalMs);
    this.nextRunAt += (missed + 1) * this.intervalMs;
    this.arm();

    void Promise.resolve().then(this.callback);
  }

  protected arm(): void {
    const remaining = Math.max(0, (this.nextRunAt ?? Date.now()) - Date.now());
    const delay = Math.min(remaining, TimerJobAdapter.MaxTimeoutMs);

    this.timeout = setTimeout(() => this.onTimeout(), delay);
  }
}
