import type { CommandRepository } from './CommandRepository.js';

/** Type of immutable {@link CommandRepository}. */
export interface ReadonlyCommandRepository
  extends Omit<CommandRepository, 'addCommand' | 'removeCommand' | 'clear'> {}
