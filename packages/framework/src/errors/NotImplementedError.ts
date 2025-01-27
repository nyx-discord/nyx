import { IllegalStateError } from '@nyx-discord/core';

/**
 * An error for trying to access code whose implementation hasn't been written.
 * See Apache Commons'
 * {@link https://commons.apache.org/proper/commons-lang/javadocs/api-release/org/apache/commons/lang3/NotImplementedException.html NotImplementedException}.
 */
export class NotImplementedError extends IllegalStateError {
  constructor(message?: string) {
    super(
      `A code block was tried to be executed, but no implementation for it has been declared${
        message ? `: ${message}` : ''
      }`,
    );
  }
}
