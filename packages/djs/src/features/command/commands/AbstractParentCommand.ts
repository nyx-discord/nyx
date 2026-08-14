import { BaseParentCommand } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

export abstract class AbstractParentCommand extends BaseParentCommand<DjsInteractionTypes> {}
