import type { CoreInteraction } from './CoreInteraction';

/**
 * A bare interaction payload (HTTP transport, any raw-payload library), or the
 * `@discordjs/core` event props, which carry the interaction as `data`.
 */
export type CoreInteractionInput =
  CoreInteraction | { readonly data: CoreInteraction };
