import type {
  BotServiceEvent,
  PluginEvent,
  ScheduleEvent,
} from '@nyx-discord/types';
import {
  AbstractBusSubscriber,
  AbstractPluginSubscriber,
  AbstractScheduleSubscriber,
  AbstractServiceSubscriber,
  BaseClientSubscriber,
  BaseCommandSubscriber,
} from '@nyx-discord/base';
import { LoaderError } from '../../error/LoaderError';
import { ModuleUtils } from '../../util/ModuleUtils';
import { ObjectInstantiator } from '../../util/ObjectInstantiator';
import type { LoaderOptions } from '../LoaderOptions';

type EventSubscriberBuckets = {
  client: BaseClientSubscriber[];
  command: BaseCommandSubscriber[];
  service: AbstractServiceSubscriber<BotServiceEvent>[];
  plugin: AbstractPluginSubscriber<PluginEvent>[];
  bus: AbstractBusSubscriber[];
  schedule: AbstractScheduleSubscriber<ScheduleEvent>[];
};

export class EventLoader {
  private static readonly SUBSCRIBER_CHECKS = [
    {
      bucket: 'client' as const,
      Class: BaseClientSubscriber,
    },
    {
      bucket: 'command' as const,
      Class: BaseCommandSubscriber,
    },
    {
      bucket: 'service' as const,
      Class: AbstractServiceSubscriber,
    },
    {
      bucket: 'plugin' as const,
      Class: AbstractPluginSubscriber,
    },
    {
      bucket: 'bus' as const,
      Class: AbstractBusSubscriber,
    },
    {
      bucket: 'schedule' as const,
      Class: AbstractScheduleSubscriber,
    },
  ] as const;

  public static async load(
    options: LoaderOptions,
  ): Promise<EventSubscriberBuckets> {
    const files = await ModuleUtils.recurseDir(options.path, options.filter);
    const errors: string[] = [];
    const buckets: EventSubscriberBuckets = {
      client: [],
      command: [],
      service: [],
      plugin: [],
      bus: [],
      schedule: [],
    };

    for (const file of files) {
      const mod = await ModuleUtils.importModule(file);
      for (const [exportName, exported] of Object.entries(mod)) {
        if (!ModuleUtils.isConstructor(exported)) continue;

        const result = this.classifyExport(exported);
        if ('error' in result) {
          errors.push(`Export "${exportName}" at "${file}" ${result.error}`);
          continue;
        }

        const instance = ObjectInstantiator.instantiateModule(
          exported as new (...args: any[]) => object,
          options.bot,
          undefined,
          file,
        );
        buckets[result.bucket].push(instance as any);
      }
    }

    if (errors.length) {
      throw new LoaderError(options.path, errors.join('\n'));
    }

    if (!options.register) return buckets;

    if (buckets.client.length) {
      await options.bot.subscribeToClient(...buckets.client);
    }
    if (buckets.command.length) {
      await options.bot.getCommandManager().subscribe(...buckets.command);
    }
    if (buckets.service.length) {
      await options.bot.getService().subscribe(...buckets.service);
    }
    if (buckets.plugin.length) {
      await options.bot.getPluginManager().subscribe(...buckets.plugin);
    }
    if (buckets.schedule.length) {
      await options.bot.getScheduleManager().subscribe(...buckets.schedule);
    }

    return buckets;
  }

  private static classifyExport(
    value: unknown,
  ): { bucket: keyof EventSubscriberBuckets } | { error: string } {
    const matches: (keyof EventSubscriberBuckets)[] = [];

    for (const { bucket, Class } of this.SUBSCRIBER_CHECKS) {
      if ((value as any).prototype instanceof Class) {
        matches.push(bucket);
      }
    }

    if (matches.length === 0) {
      return {
        error: 'does not extend a known subscriber base class',
      };
    }

    if (matches.length > 1) {
      return {
        error: `ambiguously extends multiple subscriber types: ${matches.join(', ')}`,
      };
    }

    const bucket = matches[0];
    if (!bucket) {
      return {
        error: 'does not extend a known subscriber base class',
      };
    }

    return { bucket };
  }
}
