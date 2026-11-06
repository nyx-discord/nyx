# Schedule Internals (https://nyx-discord.github.io/nyx/guide@v3/extend/schedules)

The schedule system stores tasks, tracks when they should run, and executes them with middleware and error handling.

## Schedule system components [#schedule-system-components]

Specifically, these components are:

- [`ScheduleManager`](/extend/schedules/schedule-manager): The entry point for the schedule system, orchestrating the repository, executor, scheduler, and lifecycle events.
- [`ScheduleRepository`](/extend/schedules/schedule-repository): Stores all the currently registered schedules.
- [`ScheduleExecutionScheduler`](/extend/schedules/schedule-execution-scheduler): Determines *when* a schedule should run next and creates the job adapter.
- [`ScheduleJobAdapter`](/extend/schedules/schedule-job-adapter): Wraps the underlying job instance (e.g. a croner `Cron` object, or a timeout).
- [`ScheduleExecutor`](/extend/schedules/schedule-executor): Executes schedules, checking their middleware list and handling errors.
- [`ScheduleMiddlewareList`](/extend/schedules/schedule-executor/schedule-middleware-list): Manages middlewares for schedule execution, including filters.
- [`ScheduleErrorHandler`](/extend/schedules/schedule-executor/schedule-error-handler): Handles middleware and schedule execution errors.

## Execution flow [#execution-flow]

<Steps>
<Step>
### Registration and lifecycle [#registration-and-lifecycle]

When you add a schedule, the `ScheduleManager` stores it in the `ScheduleRepository`, asks the `ScheduleExecutionScheduler` to create a job, and then emits `ScheduleEventEnum.ScheduleAdd`. Removing a schedule follows the same coordination path in reverse and emits `ScheduleEventEnum.ScheduleRemove`.

<ScheduleRegistrationDiagram />

</Step>
<Step>
### Runtime execution [#runtime-execution]

When the job fires, the `ScheduleJobAdapter` hands control to the `ScheduleExecutor`, which checks middlewares, executes the schedule's `tick()` method, and forwards errors to the configured `ScheduleErrorHandler`.

<ScheduleExecutionDiagram />

</Step>
</Steps>

Next, see the documentation of each component, where you'll find what it does and how to replace it.
