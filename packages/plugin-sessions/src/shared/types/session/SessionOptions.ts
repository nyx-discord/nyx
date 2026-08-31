import type { InteractionTypes, NyxBot } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction';

/** Options to construct a session. */
export type SessionOptions<Types extends InteractionTypes = InteractionTypes> =
  {
    /** The bot that owns the session. */
    bot: NyxBot;
    /** The ID of the session. */
    id: string;
    /** The interaction that started the session. */
    startInteraction: SessionStartInteraction<Types>;
    /** The TTL of the session in milliseconds. */
    ttl?: number;
  };
