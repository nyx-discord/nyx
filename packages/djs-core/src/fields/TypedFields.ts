import {
  type NyxBot,
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
export const TypedFields: typeof BaseTypedFields & {
  /** Field that sets/gets the bot instance as a CoreBot. */
  readonly CoreBot: TypedField<CoreBot>;

  /** Field that sets/gets the bot instance as a CoreBot connected through the gateway, whose client is a {@link CoreNyxClient}. */
  readonly GatewayCoreBot: TypedField<GatewayBot>;
} = {
  ...BaseTypedFields,
  CoreBot: BaseTypedFields.Bot as unknown as TypedField<CoreBot>,
  GatewayCoreBot: BaseTypedFields.Bot as unknown as TypedField<GatewayBot>,
} as const;
