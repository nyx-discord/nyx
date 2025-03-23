/** An error that wraps other errors that occur during features executions, helps to provide additional context about the execution. */
export class FeatureError<ErroredObject extends object> extends Error {
  public override readonly stack: string;

  protected readonly errored: ErroredObject;

  protected readonly error: Error;

  constructor(error: Error, errored: ErroredObject, message?: string) {
    super(message ?? `There was an error while running an object: \n${error}`);

    this.error = error;
    this.errored = errored;
    this.stack = `${this.message} ('${
      this.errored.constructor.name ?? 'unknown'
    }') \n${this.error.stack}`;
  }

  /** Returns the original thrown error. */
  public getError(): Error {
    return this.error;
  }

  /** Returns the object that caused the error. */
  public getCause(): ErroredObject {
    return this.errored;
  }
}
