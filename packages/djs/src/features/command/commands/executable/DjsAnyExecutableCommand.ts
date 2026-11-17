import type { AnyExecutableCommand } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../../types/DjsInteractionTypes.js';

/** Type of any discord.js command that can be executed. */
export type DjsAnyExecutableCommand = AnyExecutableCommand<DjsInteractionTypes>;
