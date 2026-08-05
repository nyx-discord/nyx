import { AbstractSchedule } from '@nyx-discord/framework';

export class WeeklySchedule extends AbstractSchedule {
  interval = '0 0 * * 0';

  tick(meta) {}
}
