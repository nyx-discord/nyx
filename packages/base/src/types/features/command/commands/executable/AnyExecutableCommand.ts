import type { Nameable } from '#types/types/Nameable';
import type { ApplicationCommandInteraction } from '../../interaction/ApplicationCommandInteraction';
import type { InteractionTypes } from '../../InteractionTypes';
import type { ExecutableCommand } from './ExecutableCommand';

export type AnyExecutableCommand<
  Types extends InteractionTypes = InteractionTypes,
> = ExecutableCommand<Nameable, ApplicationCommandInteraction<Types>, Types>;
