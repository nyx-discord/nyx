import type {
  AnyExecutableCommand,
  CommandExecutionArgs,
  CommandMiddleware,
} from '@nyx-discord/core';

import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware.js';

export abstract class AbstractCommandMiddleware
  extends AbstractMiddleware<AnyExecutableCommand, CommandExecutionArgs>
  implements CommandMiddleware {}
