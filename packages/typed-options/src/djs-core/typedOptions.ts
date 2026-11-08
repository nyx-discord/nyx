import type { OptionRecord } from '../base/definition/OptionRecord.js';
import type { WithOptions } from '../base/definition/WithOptions.js';
import { CoreOptionResolver } from './CoreOptionResolver.js';
import type { CoreTypedOptions } from './CoreTypedOptions.js';
import type { CoreInteractionInput } from './interaction/CoreInteractionInput';

/** Typed options over the `@discordjs/core` event props or a bare raw interaction payload */
export function typedOptions<Data extends WithOptions<OptionRecord>>(
  _data: Data,
  interaction: CoreInteractionInput,
): CoreTypedOptions<Data> {
  return new CoreOptionResolver(
    interaction,
  ) as unknown as CoreTypedOptions<Data>;
}
