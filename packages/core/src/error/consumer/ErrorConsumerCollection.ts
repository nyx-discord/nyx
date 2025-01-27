import type { Collection } from '@discordjs/collection';
import type { AnyClass } from '../../types/AnyClass.js';
import type { Constructor } from '../../types/Constructor.js';
import type { ErrorConsumer } from './ErrorConsumer.js';

/**
 * Type of Collection that contains {@link ErrorConsumer}, keyed by the constructors
 * of the Errors they consume.
 *
 * Same as `Collection<Constructor, ErrorConsumer<AnyClass, ErroredObject, Args>>` except it overrides
 * the get method's return type to specify that getting a class returns a consumer for that
 * specific class.
 */
export type ErrorConsumerCollection<
  ErroredObject,
  Args extends unknown[],
> = Collection<Constructor, ErrorConsumer<AnyClass, ErroredObject, Args>> & {
  get<const ErrorType extends AnyClass>(
    key: ErrorType,
  ): ErrorConsumer<ErrorType, ErroredObject, Args> | undefined;
};
