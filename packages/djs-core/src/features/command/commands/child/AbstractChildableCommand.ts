import { BaseChildableCommand } from '@nyx-discord/base';
import type {
  ChildCommand,
  InteractionTypes,
  Nameable,
} from '@nyx-discord/types';
import type { CoreInteractionTypes } from '../../../../types/CoreInteractionTypes.js';

export abstract class AbstractChildableCommand<
  Data extends Nameable,
  Child extends ChildCommand<Nameable, any, InteractionTypes>,
> extends BaseChildableCommand<Data, Child, CoreInteractionTypes> {}
