import type { ClassImplements } from '../../../../types/ClassImplements.js';
import type { InteractionTypes } from '../../InteractionTypes';
import type { StandaloneCommand } from '../StandaloneCommand';

/** Type of class that implements the {@link StandaloneCommand} interface. */
export type ImplementsStandaloneCommand<
  Types extends InteractionTypes = InteractionTypes,
> = ClassImplements<StandaloneCommand<Types>>;
