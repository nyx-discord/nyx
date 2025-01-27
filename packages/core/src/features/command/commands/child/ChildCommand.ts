import type { Command } from '../Command';
import type { ChildableCommand } from './ChildableCommand';

/** A command that belongs to a {@link ChildableCommand}. */
export interface ChildCommand<Data, Parent extends ChildableCommand<any, any>>
  extends Command<Data> {
  /** Returns this command's parent. */
  getParent(): Parent;
}
