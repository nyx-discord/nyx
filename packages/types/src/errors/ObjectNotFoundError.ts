/** An error for trying to access non-existent objects. */
export class ObjectNotFoundError extends Error {
  constructor(message?: string) {
    super(`A requested object wasn't found${message ? `: ${message}` : ''}`);
  }
}
