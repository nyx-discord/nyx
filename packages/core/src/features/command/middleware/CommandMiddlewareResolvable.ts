import type { MiddlewareResolvableFrom } from '../../../middleware/MiddlewareResolvable';
import type { CommandMiddleware } from './CommandMiddleware';

export type CommandMiddlewareResolvable =
  MiddlewareResolvableFrom<CommandMiddleware>;
