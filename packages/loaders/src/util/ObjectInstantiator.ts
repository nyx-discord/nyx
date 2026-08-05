import type { Constructor, NyxBot } from '@nyx-discord/framework';
import { LoaderError } from '../error/LoaderError.js';

type AbstractCtor<T extends object> = abstract new (...args: any[]) => T;

interface WithCreate<T extends object> {
  create(bot: NyxBot, parent?: object): T;
}

function hasCreate<T extends object>(
  Class: AbstractCtor<T>,
): Class is AbstractCtor<T> & WithCreate<T> {
  return typeof (Class as any).create === 'function';
}

export class ObjectInstantiator {
  public static instantiateModule<T extends object>(
    ModuleClass: AbstractCtor<T>,
    bot: NyxBot,
    parent?: object,
    modulePath?: string,
  ): T {
    const minArgs = parent === undefined ? 0 : 1;
    const actualArgs = ModuleClass.length;

    try {
      if (hasCreate(ModuleClass)) {
        return parent === undefined
          ? ModuleClass.create(bot)
          : ModuleClass.create(bot, parent);
      }

      if (actualArgs === minArgs) {
        return parent === undefined
          ? new (ModuleClass as Constructor<T>)()
          : new (ModuleClass as Constructor<T>)(parent);
      }
    } catch (error) {
      throw new LoaderError(
        modulePath ?? 'unknown',
        'Failed to instantiate module',
        error,
      );
    }

    throw new LoaderError(
      modulePath ?? 'unknown',
      `Constructor expects ${actualArgs} params but no static create(bot${parent === undefined ? '' : ', parent'}) found. `
        + `Minimum required args: ${minArgs}.`,
    );
  }
}
