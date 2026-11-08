import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { NoOptions } from '../../definition/NoOptions';
import type { OptionRecord } from '../../definition/OptionRecord';
import { toApiOptions } from '../toApiOptions';
import type { SubcommandData } from './SubcommandData';

/**
 * Creates a subcommand whose options are inferred by name. Pass the subcommand's own data to
 * `typedOptions` to read them.
 */
export function subcommand<
  const Options extends OptionRecord = NoOptions,
>(data: {
  readonly name: string;
  readonly description: string;
  readonly options?: Options;
}): SubcommandData<Options> {
  const { options, ...rest } = data;
  return {
    ...rest,
    type: ApplicationCommandOptionType.Subcommand,
    ...(options ? { options: toApiOptions(options) } : {}),
  };
}
