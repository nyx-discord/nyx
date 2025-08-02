import type { AnyExecutableCommand } from '@nyx-discord/core';
import { BasicFilterCheckMiddleware } from '../../../../filter/middleware/BasicFilterCheckMiddleware.js';

export class CommandFilterCheckMiddleware extends BasicFilterCheckMiddleware<AnyExecutableCommand> {}
