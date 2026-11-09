import type {
  ChildCommand,
  InteractionTypes,
  Nameable,
} from '@nyx-discord/base';
import { BaseChildableCommand } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../../types/DjsInteractionTypes.js';

export abstract class AbstractChildableCommand<
  Data extends Nameable,
  Child extends ChildCommand<Nameable, any, InteractionTypes>,
> extends BaseChildableCommand<Data, Child, DjsInteractionTypes> {}
