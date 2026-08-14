import { AbstractSchedule } from '@nyx-discord/base';

export class DailySchedule extends AbstractSchedule {
  interval = '0 0 * * *';

  tick(meta) {}
}
