import type { API, Client } from '@discordjs/core';
import {
  type NyxBot,
  type ReadonlyMetadata,
  type TypedField,
  TypedFields as BaseTypedFields,
} from '@nyx-discord/base';
import type { CoreBot, CoreBotDependencies } from '../bot/CoreBot';
import type { CoreNyxClient } from '../client/CoreNyxClient';

// omitting the client first, since intersecting it would keep CoreClient's getEmitter() overload
type GatewayBot = NyxBot<
  Omit<CoreBotDependencies, 'client'> & { client: CoreNyxClient }
>;

// these are the Bot field typed for this adapter, so they're set wherever Bot is
const CoreBotField = BaseTypedFields.Bot as unknown as TypedField<CoreBot>;
const GatewayCoreBotField =
  BaseTypedFields.Bot as unknown as TypedField<GatewayBot>;

export const TypedFields: typeof BaseTypedFields & {
  /** Field that sets/gets the bot instance as a CoreBot. */
  readonly CoreBot: TypedField<CoreBot>;

  /** Field that sets/gets the bot instance as a CoreBot connected through the gateway, whose client is a {@link CoreNyxClient}. */
  readonly GatewayCoreBot: TypedField<GatewayBot>;

  /**
   * Returns the bot from the given metadata, as a CoreBot.
   *
   * @throws {Error} If the metadata has no bot.
   */
  readonly getBot: (meta: ReadonlyMetadata) => CoreBot;

  /**
   * Returns the @discordjs/core gateway client of the bot from the given metadata, for bots connected through the gateway.
   *
   * @throws {Error} If the metadata has no bot.
   */
  readonly getClient: (meta: ReadonlyMetadata) => Client;

  /**
   * Returns the @discordjs/core REST API of the bot from the given metadata, for bots connected through the gateway or over HTTP.
   *
   * @throws {Error} If the metadata has no bot.
   */
  readonly getApi: (meta: ReadonlyMetadata) => API;
} = {
  ...BaseTypedFields,
  CoreBot: CoreBotField,
  GatewayCoreBot: GatewayCoreBotField,
  getBot: (meta) => CoreBotField.get(meta, true),
  getClient: (meta) =>
    GatewayCoreBotField.get(meta, true).getClient().getEmitter(),
  getApi: (meta) => CoreBotField.get(meta, true).getClient().getApi(),
} as const;
