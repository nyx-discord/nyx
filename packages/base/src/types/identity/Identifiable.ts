import type { Identifier } from './Identifier.js';

/** An object that can be uniquely identified. */
export interface Identifiable<IdentifierType = Identifier> {
  /** Returns the identifier of this object. */
  getId(): IdentifierType;
}
