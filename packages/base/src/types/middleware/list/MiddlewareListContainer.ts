import type { MiddlewareResolvable } from '../MiddlewareResolvable';
import type { MiddlewareList } from './MiddlewareList';

/** An object that contains a middleware list. */
export interface MiddlewareListContainer<
  MiddlewareType extends MiddlewareResolvable<any, any>,
> {
  /** Returns this object's middleware list. */
  getMiddleware(): MiddlewareList<MiddlewareType>;
}
