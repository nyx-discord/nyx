import type { TypedField } from '@nyx-discord/djs-core';
import { TypedFields as CoreTypedFields } from '@nyx-discord/djs-core';
import type { HttpBot } from '../bot/HttpBot.js';
import type { HttpEndpointRequest } from '../endpoint/HttpEndpointRequest.js';

// replaces djs-core's TypedFields, hiding GatewayCoreBot since HTTP bots have no gateway client
export const TypedFields: Omit<typeof CoreTypedFields, 'GatewayCoreBot'> & {
  /** Field that sets/gets the bot instance as an {@link HttpBot}, whose client is an {@link HttpNyxClient}. */
  readonly HttpBot: TypedField<HttpBot>;

  /** Field that sets/gets the HTTP request an interaction or webhook event came from, or `null` if it didn't come from one. */
  readonly HttpRequest: TypedField<HttpEndpointRequest | null>;
} = {
  ...CoreTypedFields,
  // the Bot field typed for HTTP bots, so it's set wherever Bot is
  HttpBot: CoreTypedFields.Bot as unknown as TypedField<HttpBot>,
  HttpRequest: CoreTypedFields.create<HttpEndpointRequest | null>(
    'HttpRequest',
  ),
} as const;
