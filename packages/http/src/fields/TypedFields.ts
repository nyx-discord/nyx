import type { ReadonlyMetadata, TypedField } from '@nyx-discord/djs-core';
import { TypedFields as CoreTypedFields } from '@nyx-discord/djs-core';
import type { HttpBot } from '../bot/HttpBot.js';
import type { HttpEndpointRequest } from '../endpoint/HttpEndpointRequest.js';

// the Bot field typed for HTTP bots, so it's set wherever Bot is
const HttpBotField = CoreTypedFields.Bot as unknown as TypedField<HttpBot>;

// replaces djs-core's TypedFields, hiding GatewayCoreBot and getClient since HTTP bots have no gateway client
export const TypedFields: Omit<
  typeof CoreTypedFields,
  'GatewayCoreBot' | 'getBot' | 'getClient'
> & {
  /** Field that sets/gets the bot instance as an {@link HttpBot}, whose client is an {@link HttpNyxClient}. */
  readonly HttpBot: TypedField<HttpBot>;

  /** Field that sets/gets the HTTP request an interaction or webhook event came from, or `null` if it didn't come from one. */
  readonly HttpRequest: TypedField<HttpEndpointRequest | null>;

  /**
   * Returns the bot from the given metadata, as an {@link HttpBot}.
   *
   * @throws {Error} If the metadata has no bot.
   */
  readonly getBot: (meta: ReadonlyMetadata) => HttpBot;
} = {
  ...CoreTypedFields,
  HttpBot: HttpBotField,
  HttpRequest: CoreTypedFields.create<HttpEndpointRequest | null>(
    'HttpRequest',
  ),
  getBot: (meta) => HttpBotField.get(meta, true),
} as const;
