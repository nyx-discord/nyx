import type {
  Constructor,
  InjectableBotDependencies,
  InteractionTypes,
  NyxBot,
} from '@nyx-discord/types';
import { LoaderError } from '../error/LoaderError.js';

type AbstractCtor<T extends object> = abstract new (...args: any[]) => T;

interface WithCreate<
  T extends object,
  Types extends InteractionTypes = InteractionTypes,
> {
  create(bot: NyxBot<InjectableBotDependencies<Types>>, parent?: object): T;
}

function hasCreate<
  T extends object,
  Types extends InteractionTypes = InteractionTypes,
>(Class: AbstractCtor<T>): Class is AbstractCtor<T> & WithCreate<T, Types> {
  return typeof (Class as any).create === 'function';
}

export class ObjectInstantiator {
  public static instantiateModule<
    T extends object,
    Types extends InteractionTypes = InteractionTypes,
  >(
    ModuleClass: AbstractCtor<T>,
    bot: NyxBot<InjectableBotDependencies<Types>>,
    parent?: object,
    modulePath?: string,
  ): T {
    const minArgs = parent === undefined ? 0 : 1;
    const actualArgs = ModuleClass.length;

    try {
      if (hasCreate<T, Types>(ModuleClass)) {
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
