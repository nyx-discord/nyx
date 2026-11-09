/**
 * An error for assertion failures.
 * See Java's
 * {@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/AssertionError.html AssertionError}.
 */
export class AssertionError extends Error {
  constructor(message?: string) {
    super(`An assertion has failed${message ? `: ${message}` : ''}`);
  }
}
