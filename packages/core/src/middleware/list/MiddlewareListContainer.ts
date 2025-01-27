import type { Middleware } from '../Middleware.js';
import type { MiddlewareList } from './MiddlewareList';

/** An object that contains a middleware list. */
export interface MiddlewareListContainer<
  MiddlewareType extends Middleware<any, any>,
> {
  /** Returns this object's middleware list. */
  getMiddleware(): MiddlewareList<MiddlewareType>;
}
