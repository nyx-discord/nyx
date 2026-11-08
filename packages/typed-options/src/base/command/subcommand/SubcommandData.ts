import type { APIApplicationCommandSubcommandOption } from 'discord-api-types/v10';
import type { OptionRecord } from '../../definition/OptionRecord';
import type { WithOptions } from '../../definition/WithOptions';

/** Plain subcommand JSON that carries its option definitions in its type. */
export type SubcommandData<Options extends OptionRecord> =
  APIApplicationCommandSubcommandOption & WithOptions<Options>;
