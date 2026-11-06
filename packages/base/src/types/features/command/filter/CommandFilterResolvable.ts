import type { FilterResolvableFrom } from '#types/filter/FilterResolvable';
import type { InteractionTypes } from '../InteractionTypes';
import type { CommandFilter } from './CommandFilter';

export type CommandFilterResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = FilterResolvableFrom<CommandFilter<Types>>;
