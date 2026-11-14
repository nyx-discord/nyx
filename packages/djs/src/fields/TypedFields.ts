import {
  type ReadonlyMetadata,
  type TypedField,
  TypedFields as BaseTypedFields,
} from '@nyx-discord/base';
import type { Client } from 'discord.js';
import type { DjsBot } from '../bot/DjsBot';

// this is the Bot field typed for this adapter, so it's set wherever Bot is
const DjsBotField = BaseTypedFields.Bot as unknown as TypedField<DjsBot>;

export const TypedFields: typeof BaseTypedFields & {
  /** Field that sets/gets the bot instance as a DjsBot. */
  readonly DjsBot: TypedField<DjsBot>;

  /**
   * Returns the bot from the given metadata, as a DjsBot.
   *
   * @throws {Error} If the metadata has no bot.
   */
  readonly getBot: (meta: ReadonlyMetadata) => DjsBot;

  /**
   * Returns the discord.js client of the bot from the given metadata.
   *
   * @throws {Error} If the metadata has no bot.
   */
  readonly getClient: (meta: ReadonlyMetadata) => Client;
} = {
  ...BaseTypedFields,
  DjsBot: DjsBotField,
  getBot: (meta) => DjsBotField.get(meta, true),
  getClient: (meta) => DjsBotField.get(meta, true).getClient().getEmitter(),
} as const;
