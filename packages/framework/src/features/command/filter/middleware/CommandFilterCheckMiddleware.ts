import type { AnyExecutableCommand } from '@nyx-discord/core';

import { BasicFilterCheckMiddleware } from '../../../../filter/middleware/BasicFilterCheckMiddleware.js';

// eslint-disable-next-line max-len
export class CommandFilterCheckMiddleware extends BasicFilterCheckMiddleware<AnyExecutableCommand> {}
