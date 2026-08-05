import { AbstractSchedule } from '@nyx-discord/framework';

export class DailySchedule extends AbstractSchedule {
  interval = '0 0 * * *';

  tick(meta) {}
}
