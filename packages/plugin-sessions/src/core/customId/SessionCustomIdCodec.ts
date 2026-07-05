import type { CustomIdCodec } from '@nyx-discord/framework';
import type { SessionCustomIdData } from './data/SessionCustomIdData';

/** An object responsible for creating and manipulating customIds that refer to session IDs. */
export interface SessionCustomIdCodec
  extends CustomIdCodec<SessionCustomIdData> {}
