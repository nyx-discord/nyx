import type { ClassImplements } from '#types/types/ClassImplements';
import type { InteractionTypes } from '../../InteractionTypes';
import type { ParentCommand } from '../ParentCommand.js';

/** Type of class that implements the {@link ParentCommand} interface. */
export type ImplementsParentCommand<
  Types extends InteractionTypes = InteractionTypes,
> = ClassImplements<ParentCommand<Types>>;
