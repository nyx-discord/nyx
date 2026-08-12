import type { ClassImplements } from '../../../../types/ClassImplements.js';
import type { InteractionTypes } from '../../InteractionTypes';
import type { SubCommand } from '../SubCommand.js';

/** Type of class that implements the {@link SubCommand} interface. */
export type ImplementsSubCommand<
  Types extends InteractionTypes = InteractionTypes,
> = ClassImplements<SubCommand<Types>>;
