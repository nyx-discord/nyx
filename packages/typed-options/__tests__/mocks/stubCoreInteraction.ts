import type { CoreInteraction } from '../../src/djs-core';

export function stubCoreInteraction(
  options: unknown[],
  resolved: unknown = {},
): CoreInteraction {
  return {
    token: 'token',
    data: { name: 'stub', options, resolved },
  } as unknown as CoreInteraction;
}
