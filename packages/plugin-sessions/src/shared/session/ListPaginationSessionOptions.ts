import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionOptions } from './SessionOptions';

/** Options to construct a list pagination session. */
export type ListPaginationSessionOptions<
  Item,
  Types extends InteractionTypes = InteractionTypes,
> = SessionOptions<Types> & {
  /** The items to paginate. */
  items: Item[];
  /** The amount of items shown per page. */
  itemsPerPage?: number;
};
