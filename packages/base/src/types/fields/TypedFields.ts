import type { TypedField as LibTypedField } from 'typed-field';
import { createTypedField } from 'typed-field';
import type { NyxBot } from '../bot/NyxBot';
import type { AnyEventBus } from '../features/event/bus/AnyEventBus';
import type { Identifier } from '../identity/Identifier';
import type { NyxLogger } from '../log/NyxLogger';
import type { ReadonlyMetadata } from '../meta/ReadonlyMetadata';

/** Type of a typed field. */
export type TypedField<T> = LibTypedField<T>;

const BotField = createTypedField<NyxBot>('NyxBot');

/** Stores known typed fields for the framework and re-exports the typed-field library. */
export const TypedFields = {
  /** Field that sets/gets the bot instance. */
  Bot: BotField,

  /** Field that sets/gets the identifier of this object. */
  Id: createTypedField<Identifier>('Identifier'),

  /** Field that sets/gets the creation date of this object. */
  CreationDate: createTypedField<Date>('Date'),

  /** Field that sets/gets whether a event was handled by a subscriber. */
  EventHandled: createTypedField<boolean>('EventHandled'),

  /** Field that sets/gets the event bus that dispatched an event. */
  EventBus: createTypedField<AnyEventBus>('EventBus'),

  /** Field that sets/gets the extra data of a custom id. */
  CustomIdExtra: createTypedField<string>('CustomIdExtra'),

  /** Creates a typed field. */
  create: createTypedField,

  /**
   * Returns the logger of the bot from the given metadata.
   *
   * @throws {Error} If the metadata has no bot.
   */
  getLogger: (meta: ReadonlyMetadata): NyxLogger =>
    BotField.get(meta, true).getLogger(),
} as const;
