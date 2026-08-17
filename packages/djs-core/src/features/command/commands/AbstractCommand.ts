import { BaseCommand } from '@nyx-discord/base';
import type { Nameable } from '@nyx-discord/types';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

export abstract class AbstractCommand<
  Data extends Nameable,
> extends BaseCommand<Data, CoreInteractionTypes> {}
