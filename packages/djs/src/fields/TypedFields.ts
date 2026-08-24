import {
  type TypedField,
  TypedFields as BaseTypedFields,
} from '@nyx-discord/types';
import type { DjsBot } from '../bot/DjsBot';

export const TypedFields: typeof BaseTypedFields & {
  /** Field that sets/gets the bot instance as a DjsBot. */
  readonly DjsBot: TypedField<DjsBot>;
} = {
  ...BaseTypedFields,
  DjsBot: BaseTypedFields.create<DjsBot>('DjsBot'),
} as const;
