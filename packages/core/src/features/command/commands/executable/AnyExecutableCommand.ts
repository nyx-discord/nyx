import type { ApplicationCommandInteraction } from '../../interaction/ApplicationCommandInteraction';
import type { ExecutableCommand } from './ExecutableCommand';

export type AnyExecutableCommand = ExecutableCommand<
  unknown,
  ApplicationCommandInteraction
>;
