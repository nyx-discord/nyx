import { BaseParentCommand } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

export abstract class AbstractParentCommand extends BaseParentCommand<CoreInteractionTypes> {}
