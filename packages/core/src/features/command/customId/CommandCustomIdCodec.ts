import type { CustomIdCodec } from '../../../customId/CustomIdCodec';
import type { CommandCustomIdData } from './data/CommandCustomIdData';

/** An object responsible for creating and manipulating customIds that refer to command names. */
export interface CommandCustomIdCodec
  extends CustomIdCodec<CommandCustomIdData> {}
