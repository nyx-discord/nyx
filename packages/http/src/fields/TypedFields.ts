import type {
  CoreBotDependencies,
  NyxBot,
  TypedField,
} from '@nyx-discord/djs-core';
import { TypedFields as CoreTypedFields } from '@nyx-discord/djs-core';
import type { HttpNyxClient } from '../client/HttpNyxClient.js';

// omitting the client first, since intersecting it would keep CoreClient's getEmitter() overload
type HttpBotType = NyxBot<
  Omit<CoreBotDependencies, 'client'> & { client: HttpNyxClient }
>;

// replaces djs-core's TypedFields, hiding GatewayCoreBot since HTTP bots have no gateway client
export const TypedFields: Omit<typeof CoreTypedFields, 'GatewayCoreBot'> & {
  /** Field that sets/gets the bot instance as an HTTP bot, whose client is an {@link HttpNyxClient}. */
  readonly HttpBot: TypedField<HttpBotType>;
} = {
  ...CoreTypedFields,
  // the Bot field typed for HTTP bots, so it's set wherever Bot is
  HttpBot: CoreTypedFields.Bot as unknown as TypedField<HttpBotType>,
} as const;
