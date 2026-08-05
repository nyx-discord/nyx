/** An error for object loading failures. */
export class LoaderError extends Error {
  readonly path: string;
  readonly reason: string;
  override readonly cause: unknown;

  constructor(path: string, reason: string, cause?: unknown) {
    super(`Loader error at "${path}": ${reason}`);
    this.name = 'LoaderError';
    this.path = path;
    this.reason = reason;
    this.cause = cause;
  }
}
