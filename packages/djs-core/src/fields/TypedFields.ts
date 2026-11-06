import {
  type TypedField,
  TypedFields as BaseTypedFields,
} from '@nyx-discord/base';
import type { CoreBot } from '../bot/CoreBot';

export const TypedFields: typeof BaseTypedFields & {
  /** Field that sets/gets the bot instance as a CoreBot. */
  readonly CoreBot: TypedField<CoreBot>;
} = {
  ...BaseTypedFields,
  CoreBot: BaseTypedFields.create<CoreBot>('CoreBot'),
} as const;
