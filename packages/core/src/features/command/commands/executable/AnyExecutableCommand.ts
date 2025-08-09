import type { Nameable } from '../../../../types/Nameable';
import type { ApplicationCommandInteraction } from '../../interaction/ApplicationCommandInteraction';
import type { ExecutableCommand } from './ExecutableCommand';

export type AnyExecutableCommand = ExecutableCommand<
  Nameable,
  ApplicationCommandInteraction
>;
