import type { Schedule } from '@nyx-discord/types';
import { AbstractSchedule } from '@nyx-discord/base';
import { LoaderError } from '../../error/LoaderError';
import { ModuleUtils } from '../../util/ModuleUtils';
import { ObjectInstantiator } from '../../util/ObjectInstantiator';
import type { LoaderOptions } from '../LoaderOptions';

export class ScheduleLoader {
  public static async load(options: LoaderOptions): Promise<Schedule[]> {
    const files = await ModuleUtils.recurseDir(options.path, options.filter);
    const errors: string[] = [];
    const schedules: Schedule[] = [];

    for (const file of files) {
      const mod = await ModuleUtils.importModule(file);
      for (const [exportName, exported] of Object.entries(mod)) {
        if (!ModuleUtils.isConstructor(exported)) continue;

        if (exported.prototype instanceof AbstractSchedule) {
          const instance = ObjectInstantiator.instantiateModule<Schedule>(
            exported as abstract new (...args: any[]) => Schedule,
            options.bot,
            undefined,
            file,
          );
          schedules.push(instance);
        } else {
          errors.push(`Export "${exportName}" at "${file}" is not a Schedule`);
        }
      }
    }

    if (errors.length) {
      throw new LoaderError(options.path, errors.join('\n'));
    }

    if (!options.register) return schedules;

    for (const schedule of schedules) {
      await options.bot.getScheduleManager().addSchedule(schedule);
    }

    return schedules;
  }
}
