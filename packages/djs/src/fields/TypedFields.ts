import {
  type TypedField,
  TypedFields as BaseTypedFields,
} from '@nyx-discord/base';
import type { DjsBot } from '../bot/DjsBot';

// this is the Bot field typed for this adapter, so it's set wherever Bot is
export const TypedFields: typeof BaseTypedFields & {
  /** Field that sets/gets the bot instance as a DjsBot. */
  readonly DjsBot: TypedField<DjsBot>;
} = {
  ...BaseTypedFields,
  DjsBot: BaseTypedFields.Bot as unknown as TypedField<DjsBot>,
} as const;
