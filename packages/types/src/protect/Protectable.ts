/** An object that can be protected, excluding it from certain functionality. */
export interface Protectable {
  /** Returns whether the object is protected. */
  isProtected(): boolean;

  /** Protects the object. */
  protect(): this;

  /** Unprotects the object. */
  unprotect(): this;
}
