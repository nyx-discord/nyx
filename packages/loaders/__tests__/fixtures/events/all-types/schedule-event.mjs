import { AbstractScheduleSubscriber } from '@nyx-discord/framework';

export class ScheduleAddSubscriber extends AbstractScheduleSubscriber {
  event = 'scheduleAdd';

  handleEvent(meta, schedule) {}
}
