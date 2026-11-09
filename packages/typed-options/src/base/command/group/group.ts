import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { OptionRecord } from '../../definition/OptionRecord';
import type { SubcommandData } from '../subcommand/SubcommandData';
import type { SubcommandGroupData } from './SubcommandGroupData';

/** Groups subcommands under one name. */
export function group(data: {
  readonly name: string;
  readonly description: string;
  readonly subcommands: readonly SubcommandData<OptionRecord>[];
}): SubcommandGroupData {
  const { subcommands, ...rest } = data;
  return {
    ...rest,
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [...subcommands],
  };
}
