import { BaseCommand } from '@nyx-discord/base';
import type { Nameable } from '@nyx-discord/types';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

export abstract class AbstractCommand<
  Data extends Nameable,
> extends BaseCommand<Data, DjsInteractionTypes> {}
