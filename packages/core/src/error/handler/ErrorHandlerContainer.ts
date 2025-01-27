import type { ErrorHandler } from './ErrorHandler.js';

/** An object that holds an ErrorHandler for handling errors within its execution. */
export interface ErrorHandlerContainer<Handler extends ErrorHandler<any, any>> {
  /** Returns this object's ErrorHandler. */
  getErrorHandler(): Handler;
}
