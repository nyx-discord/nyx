import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { NoOptions } from '../../definition/NoOptions';
import type { OptionRecord } from '../../definition/OptionRecord';
import type { SubcommandGroupData } from '../group/SubcommandGroupData';
import type { SubcommandData } from '../subcommand/SubcommandData';
import { toApiOptions } from '../toApiOptions';
import type { ChatInputData } from './ChatInputData';

type ChatInputBase = Omit<
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  'options'
>;

/** Creates chat input command data whose options are inferred by name */
export function chatInput<const Options extends OptionRecord>(
  data: ChatInputBase & { readonly options: Options },
): ChatInputData<Options>;
export function chatInput(
  data: ChatInputBase & {
    readonly subcommands: readonly (
      SubcommandData<OptionRecord> | SubcommandGroupData
    )[];
  },
): ChatInputData<NoOptions>;
export function chatInput(data: ChatInputBase): ChatInputData<NoOptions>;
export function chatInput(
  data: ChatInputBase & {
    readonly options?: OptionRecord;
    readonly subcommands?: readonly unknown[];
  },
): unknown {
  const { options, subcommands, ...rest } = data;
  if (subcommands) return { ...rest, options: [...subcommands] };
  if (options) return { ...rest, options: toApiOptions(options) };
  return rest;
}
