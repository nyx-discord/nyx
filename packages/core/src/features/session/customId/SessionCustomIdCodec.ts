import type { CustomIdCodec } from '../../../customId/CustomIdCodec.js';
import type { SessionCustomIdData } from './data/SessionCustomIdData.js';

/** An object responsible for creating and manipulating customIds that refer to session IDs. */
export interface SessionCustomIdCodec
  extends CustomIdCodec<SessionCustomIdData> {}
