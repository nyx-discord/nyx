/**
 * An error for duplicate objects.
 *
 * Typically when an object tries to be registered, but another with that ID already exists.
 */
export class IllegalDuplicateError<Of> extends Error {
  protected readonly original: Of;

  protected readonly duplicate: Of;

  constructor(original: Of, duplicate: Of, message?: string) {
    super(`An illegal duplicate was found${message ? `: ${message}` : ''}`);
    this.original = original;
    this.duplicate = duplicate;
  }

  /** Get the original object that was already in place. */
  public getOriginal(): Of {
    return this.original;
  }

  /** Get the duplicate that caused the error. */
  public getDuplicate(): Of {
    return this.duplicate;
  }
}
