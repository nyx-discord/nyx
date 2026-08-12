import type {
  AnyExecutableCommand,
  InteractionTypes,
} from '@nyx-discord/types';
import { BasicFilterCheckMiddleware } from '../../../../filter/middleware/BasicFilterCheckMiddleware.js';

export class CommandFilterCheckMiddleware<
  Types extends InteractionTypes = InteractionTypes,
> extends BasicFilterCheckMiddleware<AnyExecutableCommand<Types>> {}
