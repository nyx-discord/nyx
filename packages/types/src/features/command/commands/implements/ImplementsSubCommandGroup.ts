import type { ClassImplements } from '../../../../types/ClassImplements.js';
import type { InteractionTypes } from '../../InteractionTypes';
import type { SubCommandGroup } from '../SubCommandGroup.js';

/** Type of class that implements the {@link SubCommandGroup} interface. */
export type ImplementsSubCommandGroup<
  Types extends InteractionTypes = InteractionTypes,
> = ClassImplements<SubCommandGroup<Types>>;
