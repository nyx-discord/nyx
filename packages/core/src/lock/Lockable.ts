/** An object that can be locked, excluding it from certain functionality. */
export interface Lockable {
  /** Returns whether the object is locked. */
  isLocked(): boolean;

  /** Locks the object. */
  lock(): this;

  /** Unlocks the object. */
  unlock(): this;
}
