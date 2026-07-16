import { IllegalDuplicateError, ObjectNotFoundError } from '@nyx-discord/core';
import { describe, expect, it, test } from 'vitest';
import { DefaultScheduleRepository } from '../../../../src';
import { MockSchedule } from '../../mocks/MockSchedule';

const createRepo = () => DefaultScheduleRepository.create();

describe('DefaultScheduleRepository', () => {
  it('SHOULD create an instance of itself', () => {
    expect(DefaultScheduleRepository.create()).toBeInstanceOf(
      DefaultScheduleRepository,
    );
  });

  describe('Storage', () => {
    test("GIVEN no input THEN it's empty", () => {
      const repo = createRepo();
      expect(repo.size).toBe(0);
      expect(repo.getSchedules().size).toBe(0);
    });

    test("GIVEN a schedule THEN it's stored", () => {
      const repo = createRepo();
      const schedule = new MockSchedule();

      repo.addSchedule(schedule);

      expect(repo.size).toBe(1);
      expect(repo.getSchedules().size).toBe(1);
      expect(repo.getSchedules().has(schedule.getId())).toBe(true);
    });

    test('GIVEN a schedule is removed THEN all references are cleaned up', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();

      repo.addSchedule(schedule);
      repo.removeSchedule(schedule);

      expect(repo.size).toBe(0);
      expect(repo.getSchedules().size).toBe(0);
      expect(repo.getSchedules().has(schedule.getId())).toBe(false);
    });

    test('GIVEN a duplicate schedule THEN it throws', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);
      expect(() => repo.addSchedule(schedule, true)).toThrow(
        IllegalDuplicateError,
      );
    });

    test('GIVEN a non existing schedule THEN removing it throws', () => {
      const repo = createRepo();
      expect(() =>
        repo.removeSchedule(new MockSchedule(), true),
      ).toThrow(ObjectNotFoundError);
    });
  });

  describe('getScheduleByID', () => {
    test('GIVEN a stored schedule THEN it can be retrieved by ID', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();

      repo.addSchedule(schedule);

      expect(repo.getScheduleByID(schedule.getId())).toBe(schedule);
    });

    test('GIVEN a non-stored schedule ID THEN returns null', () => {
      const repo = createRepo();
      expect(repo.getScheduleByID(Symbol('unknown'))).toBeNull();
    });
  });

  describe('getScheduleByClass', () => {
    test('GIVEN a stored schedule THEN it can be class located', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();

      expect(repo.getScheduleByClass(MockSchedule)).toBeNull();
      repo.addSchedule(schedule);
      expect(repo.getScheduleByClass(MockSchedule)).toBe(schedule);
    });

    test('GIVEN no matching class THEN returns null', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      class OtherSchedule extends MockSchedule {}

      expect(repo.getScheduleByClass(OtherSchedule)).toBeNull();
    });
  });

  describe('has', () => {
    test('GIVEN a stored schedule THEN has returns true', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      expect(repo.has(schedule.getId())).toBe(true);
    });

    test('GIVEN no stored schedule THEN has returns false', () => {
      const repo = createRepo();
      expect(repo.has(Symbol('unknown'))).toBe(false);
    });
  });

  describe('removeSchedule', () => {
    test('GIVEN a schedule ID THEN it can be removed by ID', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      repo.removeSchedule(schedule.getId());

      expect(repo.size).toBe(0);
      expect(repo.has(schedule.getId())).toBe(false);
    });
  });

  describe('iterators', () => {
    test('GIVEN schedules THEN values yields them', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      const values = Array.from(repo.values());

      expect(values).toHaveLength(1);
      expect(values[0]).toBe(schedule);
    });

    test('GIVEN schedules THEN entries yields [id, schedule] pairs', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      const entries = Array.from(repo.entries());

      expect(entries).toHaveLength(1);
      expect(entries[0][0]).toBe(schedule.getId());
      expect(entries[0][1]).toBe(schedule);
    });

    test('GIVEN schedules THEN keys yields IDs', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      const keys = Array.from(repo.keys());

      expect(keys).toContain(schedule.getId());
    });

    test('GIVEN schedules THEN iterator yields [id, schedule] pairs', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      const iterated = Array.from(repo);

      expect(iterated).toHaveLength(1);
      expect(iterated[0][1]).toBe(schedule);
    });

    test('GIVEN schedules THEN next returns an entry', () => {
      const repo = createRepo();
      const schedule = new MockSchedule();
      repo.addSchedule(schedule);

      const result = repo.next();

      expect(result.done).toBe(false);
      expect(result.value![0]).toBe(schedule.getId());
      expect(result.value![1]).toBe(schedule);
    });
  });

  describe('onStart / onStop', () => {
    test('GIVEN a repository THEN onStart does not throw', () => {
      const repo = createRepo();
      expect(() => repo.onStart()).not.toThrow();
    });

    test('GIVEN a repository THEN onStop does not throw', () => {
      const repo = createRepo();
      expect(() => repo.onStop()).not.toThrow();
    });
  });
});
