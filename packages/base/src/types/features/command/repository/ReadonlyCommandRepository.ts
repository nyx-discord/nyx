import type { InteractionTypes } from '../InteractionTypes';
import type { CommandRepository } from './CommandRepository.js';

/** Type of immutable {@link CommandRepository}. */
export interface ReadonlyCommandRepository<
  Types extends InteractionTypes = InteractionTypes,
> extends Omit<
  CommandRepository<Types>,
  'addCommand' | 'removeCommand' | 'clear'
> {}
