import type {
  EventBus,
  Metadata,
  MetadataFactory,
  ReadonlyScheduleExecutionScheduler,
  ReadonlyScheduleRepository,
  ScheduleEventArgs,
  ScheduleExecutionScheduler,
  ScheduleExecutor,
  ScheduleManager,
  ScheduleRepository,
} from '@nyx-discord/types';
import { IllegalDuplicateError, IllegalStateError, ObjectNotFoundError } from '@nyx-discord/types';
import { describe, expect, expectTypeOf, it, test, vi } from 'vitest';
import { DefaultScheduleManager } from '../../../../src';
import { MockSchedule } from '../../mocks/MockSchedule';
import { StubScheduleEventBus } from '../../mocks/StubScheduleEventBus';
import { StubScheduleExecutionScheduler } from '../../mocks/StubScheduleExecutionScheduler';
import { StubScheduleExecutor } from '../../mocks/StubScheduleExecutor';
import { StubScheduleMetadata } from '../../mocks/StubScheduleMetadata';
import { StubScheduleRepository } from '../../mocks/StubScheduleRepository';

import { StubBot } from '../../../plugin/mocks/StubBot';

const createManager = (
  overrides?: Partial<{
    executor: ReturnType<typeof StubScheduleExecutor.create>;
    repository: ReturnType<typeof StubScheduleRepository.create>;
    scheduler: ReturnType<typeof StubScheduleExecutionScheduler.create>;
    eventBus: ReturnType<typeof StubScheduleEventBus.create>;
    metaFactory: ReturnType<typeof StubScheduleMetadata.create>;
  }>,
) =>
  new DefaultScheduleManager({
    executor: overrides?.executor ?? StubScheduleExecutor.create(),
    repository: overrides?.repository ?? StubScheduleRepository.create(),
    scheduler: overrides?.scheduler ?? StubScheduleExecutionScheduler.create(),
    eventBus: overrides?.eventBus ?? StubScheduleEventBus.create(),
    metaFactory: overrides?.metaFactory ?? StubScheduleMetadata.create(),
  });

describe('DefaultScheduleManager', () => {
  it('SHOULD create an instance of itself', () => {
    const manager = createManager();
    expect(manager).toBeInstanceOf(DefaultScheduleManager);
  });

  describe('create', () => {
    test('GIVEN default options WHEN create is called THEN instantiates with default dependencies', () => {
      const bot = StubBot.create();
      const manager = DefaultScheduleManager.create({ bot: bot as never });

      expect(manager).toBeInstanceOf(DefaultScheduleManager);
      expect(manager.getRepository()).toBeDefined();
      expect(manager.getExecutor()).toBeDefined();
      expect(manager.getScheduler()).toBeDefined();
      expect(manager.getEventBus()).toBeDefined();
      expect(manager.getMetadataFactory()).toBeDefined();

      expectTypeOf(manager).toEqualTypeOf<ScheduleManager>();
      expectTypeOf(manager.getRepository()).toEqualTypeOf<ReadonlyScheduleRepository>();
      expectTypeOf(manager.getExecutor()).toEqualTypeOf<ScheduleExecutor>();
      expectTypeOf(manager.getScheduler()).toEqualTypeOf<ReadonlyScheduleExecutionScheduler>();
      expectTypeOf(manager.getEventBus()).toEqualTypeOf<EventBus<ScheduleEventArgs>>();
      expectTypeOf(manager.getMetadataFactory()).toEqualTypeOf<MetadataFactory>();
    });

    test('GIVEN injected custom dependencies WHEN create is called THEN uses the provided instances', () => {
      const bot = StubBot.create();
      const repository = StubScheduleRepository.create();
      const executor = StubScheduleExecutor.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const eventBus = StubScheduleEventBus.create();
      const metaFactory = StubScheduleMetadata.create();

      const manager = DefaultScheduleManager.create({
        bot: bot as never,
        injections: {
          repository,
          executor,
          scheduler,
          eventBus,
          metaFactory,
        },
      });

      expect(manager.getRepository()).toBe(repository);
      expect(manager.getExecutor()).toBe(executor);
      expect(manager.getScheduler()).toBe(scheduler);
      expect(manager.getEventBus()).toBe(eventBus);
      expect(manager.getMetadataFactory()).toBe(metaFactory);

      expectTypeOf(manager).toEqualTypeOf<ScheduleManager>();
    });
  });

  describe('getters', () => {
    test('GIVEN constructor options THEN getExecutor returns the executor', () => {
      const executor = StubScheduleExecutor.create();
      const manager = createManager({ executor });

      expect(manager.getExecutor()).toBe(executor);
    });

    test('GIVEN constructor options THEN getRepository returns the repository', () => {
      const repository = StubScheduleRepository.create();
      const manager = createManager({ repository });

      expect(manager.getRepository()).toBe(repository);
    });

    test('GIVEN constructor options THEN getScheduler returns the scheduler', () => {
      const scheduler = StubScheduleExecutionScheduler.create();
      const manager = createManager({ scheduler });

      expect(manager.getScheduler()).toBe(scheduler);
    });

    test('GIVEN constructor options THEN getEventBus returns the event bus', () => {
      const eventBus = StubScheduleEventBus.create();
      const manager = createManager({ eventBus });

      expect(manager.getEventBus()).toBe(eventBus);
    });

    test('GIVEN constructor options THEN getMetadataFactory returns the metadata factory', () => {
      const metaFactory = StubScheduleMetadata.create();
      const manager = createManager({ metaFactory });

      expect(manager.getMetadataFactory()).toBe(metaFactory);
    });
  });

  describe('setters', () => {
    test('GIVEN a new executor THEN setExecutor updates and returns this', () => {
      const executor = StubScheduleExecutor.create();
      const manager = createManager({ executor });

      const result = manager.setExecutor(StubScheduleExecutor.create());

      expect(result).toBe(manager);
      expect(result.getExecutor()).not.toBe(executor);
    });

    test('GIVEN a new repository THEN setRepository updates and returns this', () => {
      const manager = createManager();

      const result = manager.setRepository(StubScheduleRepository.create());

      expect(result).toBe(manager);
    });

    test('GIVEN schedules are registered THEN setRepository throws IllegalStateError', () => {
      const repository = StubScheduleRepository.create();
      const manager = createManager({ repository });
      const schedule = new MockSchedule();
      repository.getSchedules = vi.fn().mockReturnValue(
        new Map([[schedule.getId(), schedule]]),
      );

      expect(() => manager.setRepository(StubScheduleRepository.create()))
        .toThrow(IllegalStateError);
    });

    test('GIVEN a new scheduler THEN setScheduler updates and returns this', () => {
      const manager = createManager();

      const result = manager.setScheduler(
        StubScheduleExecutionScheduler.create(),
      );

      expect(result).toBe(manager);
    });

    test('GIVEN jobs are scheduled THEN setScheduler throws IllegalStateError', () => {
      const scheduler = StubScheduleExecutionScheduler.create();
      const manager = createManager({ scheduler });
      scheduler.getJobs = vi.fn().mockReturnValue(
        new Map([[Symbol('job'), {}]]),
      );

      expect(() =>
        manager.setScheduler(StubScheduleExecutionScheduler.create()),
      ).toThrow(IllegalStateError);
    });

    test('GIVEN a new event bus THEN setEventBus transfers subscribers and updates', async () => {
      const oldBus = StubScheduleEventBus.create();
      const metaFactory = StubScheduleMetadata.create();
      const subscriber = { getId: () => Symbol('sub'), handleEvent: vi.fn(), getEvent: vi.fn() };
      vi.mocked(oldBus.getSubscribers).mockReturnValue(
        new Map([[subscriber.getId(), subscriber]]) as never,
      );
      vi.mocked(oldBus.getMetadataFactory).mockReturnValue(metaFactory);
      const manager = createManager({ eventBus: oldBus });
      const newBus = StubScheduleEventBus.create();

      await manager.setEventBus(newBus);

      expect(manager.getEventBus()).toBe(newBus);
      expect(newBus.subscribe).toHaveBeenCalledWith(subscriber);
    });

    test('GIVEN a new metadata factory THEN setMetadataFactory updates and returns this', () => {
      const metaFactory = StubScheduleMetadata.create();
      const manager = createManager({ metaFactory });

      const result = manager.setMetadataFactory(StubScheduleMetadata.create());

      expect(result).toBe(manager);
      expect(result.getMetadataFactory()).not.toBe(metaFactory);
    });
  });

  describe('onStart / onStop', () => {
    test('GIVEN a manager THEN onStart starts the repository and scheduler', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const manager = createManager({ repository, scheduler });

      await manager.onStart();

      expect(repository.onStart).toHaveBeenCalled();
      expect(scheduler.onStart).toHaveBeenCalled();
    });

    test('GIVEN a manager THEN onStop stops the repository and scheduler', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const manager = createManager({ repository, scheduler });

      await manager.onStop();

      expect(repository.onStop).toHaveBeenCalled();
      expect(scheduler.onStop).toHaveBeenCalled();
    });
  });

  describe('addSchedule', () => {
    test('GIVEN a new schedule THEN it is added, scheduled, and an event is emitted', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const eventBus = StubScheduleEventBus.create();
      const manager = createManager({ repository, scheduler, eventBus });
      const schedule = new MockSchedule();

      const job = await manager.addSchedule(schedule);

      expect(job).toBeDefined();
      expect(repository.addSchedule).toHaveBeenCalledWith(schedule);
      expect(scheduler.start).toHaveBeenCalledWith(schedule);
    });

    test('GIVEN a duplicate schedule THEN IllegalDuplicateError is thrown', async () => {
      const repository = StubScheduleRepository.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const manager = createManager({ repository });

      await expect(() => manager.addSchedule(schedule)).rejects.toThrow(
        IllegalDuplicateError,
      );
    });

    test('GIVEN repository.addSchedule succeeds but scheduler.start fails THEN rollback occurs', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const startError = new Error('start failed');
      vi.mocked(scheduler.start).mockRejectedValue(startError);
      const manager = createManager({ repository, scheduler });
      const schedule = new MockSchedule();

      await expect(() => manager.addSchedule(schedule)).rejects.toThrow(
        startError,
      );
      expect(repository.removeSchedule).toHaveBeenCalledWith(schedule);
    });

    test('GIVEN repository.addSchedule succeeds but scheduler.start fails and job was created THEN rolls back repository and destroys job and does NOT emit event', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const eventBus = StubScheduleEventBus.create();
      const startError = new Error('start failed');
      const schedule = new MockSchedule();

      vi.mocked(repository.getScheduleByID)
        .mockReturnValueOnce(null)
        .mockReturnValue(schedule);
      vi.mocked(scheduler.getJobForSchedule).mockReturnValue({} as never);
      vi.mocked(scheduler.start).mockRejectedValue(startError);

      const manager = createManager({ repository, scheduler, eventBus });

      await expect(() => manager.addSchedule(schedule)).rejects.toThrow(
        startError,
      );
      expect(repository.removeSchedule).toHaveBeenCalledWith(schedule);
      expect(scheduler.destroy).toHaveBeenCalledWith(schedule);
      expect(eventBus.emit).not.toHaveBeenCalled();
    });
  });

  describe('removeSchedule', () => {
    test('GIVEN a registered schedule THEN it is removed and destroyed', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const manager = createManager({ repository, scheduler });

      const result = await manager.removeSchedule(schedule);

      expect(result).toBe(manager);
      expect(repository.removeSchedule).toHaveBeenCalledWith(schedule);
      expect(scheduler.destroy).toHaveBeenCalledWith(schedule);
    });

    test('GIVEN a schedule ID THEN removeSchedule removes by ID', async () => {
      const repository = StubScheduleRepository.create();
      const scheduler = StubScheduleExecutionScheduler.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const manager = createManager({ repository, scheduler });

      await manager.removeSchedule(schedule.getId());

      expect(repository.removeSchedule).toHaveBeenCalledWith(schedule.getId());
      expect(scheduler.destroy).toHaveBeenCalledWith(schedule);
    });

    test('GIVEN an unregistered schedule THEN ObjectNotFoundError is thrown', async () => {
      const repository = StubScheduleRepository.create();
      vi.mocked(repository.getScheduleByID).mockReturnValue(null);
      const manager = createManager({ repository });
      const schedule = new MockSchedule();

      await expect(() => manager.removeSchedule(schedule)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('tick', () => {
    test('GIVEN a registered schedule THEN it is ticked via the executor', async () => {
      const repository = StubScheduleRepository.create();
      const executor = StubScheduleExecutor.create();
      const metaFactory = StubScheduleMetadata.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const manager = createManager({ repository, executor, metaFactory });

      const result = await manager.tick(schedule);

      expect(result).toBe(manager);
      expect(executor.tick).toHaveBeenCalledWith(schedule, expect.anything());
      expect(metaFactory.createOrPopulate).toHaveBeenCalled();
    });

    test('GIVEN a schedule ID THEN tick works by ID', async () => {
      const repository = StubScheduleRepository.create();
      const executor = StubScheduleExecutor.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const manager = createManager({ repository, executor });

      await manager.tick(schedule.getId());

      expect(executor.tick).toHaveBeenCalledWith(schedule, expect.anything());
    });

    test('GIVEN an unregistered schedule THEN ObjectNotFoundError is thrown', async () => {
      const repository = StubScheduleRepository.create();
      vi.mocked(repository.getScheduleByID).mockReturnValue(null);
      const manager = createManager({ repository });
      const schedule = new MockSchedule();

      await expect(() => manager.tick(schedule)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });

    test('GIVEN custom metadata THEN tick uses it', async () => {
      const repository = StubScheduleRepository.create();
      const executor = StubScheduleExecutor.create();
      const metaFactory = StubScheduleMetadata.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const customMeta = { key: 'value' } as Metadata;
      const manager = createManager({ repository, executor, metaFactory });

      await manager.tick(schedule, customMeta);

      expect(metaFactory.createOrPopulate).toHaveBeenCalledWith(
        customMeta,
        expect.any(Symbol),
      );
    });
  });

  describe('subscribe', () => {
    test('GIVEN event subscribers THEN they are subscribed to the bus', async () => {
      const eventBus = StubScheduleEventBus.create();
      const manager = createManager({ eventBus });
      const subscriber = {
        getId: () => Symbol('sub'),
        handleEvent: vi.fn(),
        getEvent: vi.fn(),
      };

      await manager.subscribe(subscriber as never);

      expect(eventBus.subscribe).toHaveBeenCalledWith(subscriber);
    });
  });

  describe('getScheduleByID', () => {
    test('GIVEN a registered schedule THEN getScheduleByID returns it', () => {
      const repository = StubScheduleRepository.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByID).mockReturnValue(schedule);
      const manager = createManager({ repository });

      expect(manager.getScheduleByID(schedule.getId())).toBe(schedule);
    });
  });

  describe('getScheduleByClass', () => {
    test('GIVEN a registered schedule THEN getScheduleByClass returns it', () => {
      const repository = StubScheduleRepository.create();
      const schedule = new MockSchedule();
      vi.mocked(repository.getScheduleByClass).mockReturnValue(schedule);
      const manager = createManager({ repository });

      expect(manager.getScheduleByClass(MockSchedule)).toBe(schedule);
    });
  });

  describe('getJobForSchedule', () => {
    test('GIVEN a scheduled schedule THEN getJobForSchedule returns its job', () => {
      const scheduler = StubScheduleExecutionScheduler.create();
      const schedule = new MockSchedule();
      const manager = createManager({ scheduler });

      const result = manager.getJobForSchedule(schedule);

      expect(result).toBeDefined();
    });
  });

  describe('setEventBus', () => {
    test('GIVEN a new bus THEN transfers subscribers and metadata fields', async () => {
      const oldBus = StubScheduleEventBus.create();
      const subscriber = {
        getId: () => Symbol('sub'),
        handleEvent: vi.fn(),
        getEvent: vi.fn(),
      };
      await oldBus.subscribe(subscriber as never);
      const testField = [{ set: vi.fn(), get: vi.fn() }, 'value'] as const;
      vi.mocked(oldBus.getMetadataFactory().getFields).mockReturnValue([
        testField as never,
      ]);

      const manager = createManager({ eventBus: oldBus });

      const newBus = StubScheduleEventBus.create();
      const result = await manager.setEventBus(newBus);

      expect(result).toBe(manager);
      expect(manager.getEventBus()).toBe(newBus);
      expect(newBus.subscribe).toHaveBeenCalledWith(subscriber);
      expect(newBus.getMetadataFactory().addDefaultField).toHaveBeenCalledWith(
        testField[0],
        testField[1],
      );
    });
  });
});
