/** An error for object loading failures. */
export class LoaderError extends Error {
  public readonly path: string;
  public readonly reason: string;
  public override readonly cause: unknown;

  constructor(path: string, reason: string, cause?: unknown) {
    super(`Loader error at "${path}": ${reason}`);
    this.name = 'LoaderError';
    this.path = path;
    this.reason = reason;
    this.cause = cause;
  }
}
