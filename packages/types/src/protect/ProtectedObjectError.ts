import { IllegalStateError } from '../errors/IllegalStateError.js';
import type { Protectable } from './Protectable';

/** An error thrown when an illegal operation is performed on a protected object. */
export class ProtectedObjectError<
  T extends Protectable,
> extends IllegalStateError {
  protected readonly protectedObject: T;

  constructor(protectedObject: T) {
    super(`Object '${protectedObject.constructor.name}' is protected.`);
    this.protectedObject = protectedObject;
  }

  /** Returns the detected protected object. */
  public getObject() {
    return this.protectedObject;
  }
}
