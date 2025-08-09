import type { Nameable } from '../../../../types/Nameable';
import type { Command } from '../Command';
import type { ChildableCommand } from './ChildableCommand';

/** A command that belongs to a {@link ChildableCommand}. */
export interface ChildCommand<
  Data extends Nameable,
  Parent extends ChildableCommand<any, any>,
> extends Command<Data> {
  /** Returns this command's parent. */
  getParent(): Parent;
}
