/**
 * An variable that can identify something, either of type `symbol` or `string`.
 *
 * Take in mind:
 * * `symbol` guarantees uniqueness but can't be serialized since they are runtime generated, and
 * only exist inside the node engine at the current execution.
 *
 * * `string`'s uniqueness depends on the implementation but can be serialized and deserialized
 * back.
 *
 * In general it's advised to use `symbol` for every internal object, and `string` for objects
 * meant to have some representation at Discord.
 */
export type Identifier = string | symbol;

/** Returns whether a value fits the type to be an identifier. */
export function canBeIdentifier(id: unknown): id is Identifier {
  return typeof id === 'string' || typeof id === 'symbol';
}
