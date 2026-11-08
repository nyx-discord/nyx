import type { ChatInputCommandInteraction } from 'discord.js';
import type { OptionRecord } from '../base/definition/OptionRecord.js';
import type { WithOptions } from '../base/definition/WithOptions.js';
import type { DjsTypedOptions } from './DjsTypedOptions.js';

/** Returns `interaction.options` with narrower types, this is only a type cast */
export function typedOptions<Data extends WithOptions<OptionRecord>>(
  _data: Data,
  interaction: ChatInputCommandInteraction,
): DjsTypedOptions<Data> {
  return interaction.options as unknown as DjsTypedOptions<Data>;
}
