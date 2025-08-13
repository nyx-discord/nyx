import type { Middleware } from './Middleware';

/** An object that can be resolved to a {@link Middleware}. */
export type MiddlewareResolvable<Checked, Args extends readonly unknown[]> =
  | Middleware<Checked, Args>
  | Middleware<Checked, Args>['check'];

/** Creates a {@link MiddlewareResolvable} from a {@link Middleware}. */
export type MiddlewareResolvableFrom<
  MiddlewareType extends Middleware<any, any>,
> =
  MiddlewareType extends Middleware<infer Checked, infer Args>
    ? MiddlewareResolvable<Checked, Args>
    : never;
