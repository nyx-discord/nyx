import type {
  AnyExecutableCommand,
  CommandExecutionArgs,
  CommandMiddleware,
  InteractionTypes,
} from '@nyx-discord/types';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware.js';

export abstract class BaseCommandMiddleware<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractMiddleware<
    AnyExecutableCommand<Types>,
    CommandExecutionArgs<Types>
  >
  implements CommandMiddleware<Types> {}
