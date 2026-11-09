/**
 * An error for methods invoked at an illegal or inappropriate time.
 * See Java's
 * {@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/IllegalStateException.html IllegalStateException}.
 */
export class IllegalStateError extends Error {
  constructor(message?: string) {
    super(
      `A method was executed at an innapropiate state${
        message ? `: ${message}` : ''
      }`,
    );
  }
}
