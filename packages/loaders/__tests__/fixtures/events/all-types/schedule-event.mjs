import { AbstractScheduleSubscriber } from '@nyx-discord/base';

export class ScheduleAddSubscriber extends AbstractScheduleSubscriber {
  event = 'scheduleAdd';

  handleEvent(meta, schedule) {}
}
