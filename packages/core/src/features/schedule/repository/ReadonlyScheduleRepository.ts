import type { ScheduleRepository } from './ScheduleRepository.js';

/** Type of immutable {@link ScheduleRepository}. */
export interface ReadonlyScheduleRepository
  extends Omit<ScheduleRepository, 'addSchedule' | 'removeSchedule'> {}
