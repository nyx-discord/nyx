import type { StringIterator } from '../string/StringIterator';
import type { CustomIdBuilder } from './CustomIdBuilder';

/** An object responsible for creating and manipulating customIds that refer to objects. */
export interface CustomIdCodec<Serialized> {
  /** Creates a customId that refers to the passed object. */
  serializeToCustomId(object: Serialized): string;

  /** Extracts the ID from the passed customId, if one is present. */
  deserializeToObjectId(customId: string): string | null;

  /** Creates a {@link CustomIdBuilder} that can be used to start a customId that refers to the passed object. */
  createCustomIdBuilder(object: Serialized): CustomIdBuilder;

  /** Creates a {@link StringIterator} from a customId, leaving only the data that is not related to the referred object. */
  createIteratorFromCustomId(customId: string): StringIterator | null;
}
