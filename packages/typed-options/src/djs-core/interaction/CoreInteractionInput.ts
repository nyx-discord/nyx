import type { CoreInteraction } from './CoreInteraction';

/** A bare interaction payload (HTTP transport, raw-payload libraries), or the `@discordjs/core` event props that wrap it as `data`. */
export type CoreInteractionInput =
  CoreInteraction | { readonly data: CoreInteraction };
