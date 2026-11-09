import { AbstractSchedule } from '@nyx-discord/base';

export class WeeklySchedule extends AbstractSchedule {
  interval = '0 0 * * 0';

  tick(meta) {}
}
