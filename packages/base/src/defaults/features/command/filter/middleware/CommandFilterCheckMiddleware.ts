import type { AnyExecutableCommand } from '#types/features/command/commands/executable/AnyExecutableCommand';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import { BasicFilterCheckMiddleware } from '../../../../filter/middleware/BasicFilterCheckMiddleware';

export class CommandFilterCheckMiddleware<
  Types extends InteractionTypes = InteractionTypes,
> extends BasicFilterCheckMiddleware<AnyExecutableCommand<Types>> {}
