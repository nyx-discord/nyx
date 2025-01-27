import { IllegalStateError } from '../errors/IllegalStateError.js';
import type { Lockable } from './Lockable.js';

/** An error thrown when an illegal operation is performed on a locked object. */
export class LockedObjectError<T extends Lockable> extends IllegalStateError {
  protected readonly lockedObject: T;

  constructor(lockedObject: T) {
    super(`Object '${lockedObject.constructor.name}' is locked.`);

    this.lockedObject = lockedObject;
  }

  /** Returns the detected locked object. */
  public getObject() {
    return this.lockedObject;
  }
}
