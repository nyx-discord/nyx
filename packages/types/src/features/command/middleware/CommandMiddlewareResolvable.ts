import type { MiddlewareResolvableFrom } from '../../../middleware/MiddlewareResolvable';
import type { InteractionTypes } from '../InteractionTypes';
import type { CommandMiddleware } from './CommandMiddleware';

export type CommandMiddlewareResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = MiddlewareResolvableFrom<CommandMiddleware<Types>>;
