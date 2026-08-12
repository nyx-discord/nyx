import type { Nameable } from '../../../../types/Nameable';
import type { InteractionTypes } from '../../InteractionTypes';
import type { ApplicationCommandInteraction } from '../../interaction/ApplicationCommandInteraction';
import type { ExecutableCommand } from './ExecutableCommand';

export type AnyExecutableCommand<
  Types extends InteractionTypes = InteractionTypes,
> = ExecutableCommand<Nameable, ApplicationCommandInteraction<Types>, Types>;
