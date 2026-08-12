import type { Nameable } from '../../../../types/Nameable';
import type { InteractionTypes } from '../../InteractionTypes';
import type { Command } from '../Command';
import type { ChildableCommand } from './ChildableCommand';

/** A command that belongs to a {@link ChildableCommand}. */
export interface ChildCommand<
  Data extends Nameable,
  Parent extends ChildableCommand<any, any, InteractionTypes>,
  Types extends InteractionTypes = InteractionTypes,
> extends Command<Data, Types> {
  /** Returns this command's parent. */
  getParent(): Parent;
}
