import type { AnyExecutableCommand } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../../types/CoreInteractionTypes.js';

/** Type of any @discordjs/core command that can be executed. */
export type CoreAnyExecutableCommand =
  AnyExecutableCommand<CoreInteractionTypes>;
