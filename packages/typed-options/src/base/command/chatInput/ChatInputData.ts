import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { OptionRecord } from '../../definition/OptionRecord';
import type { WithOptions } from '../../definition/WithOptions';

/** Plain chat input command JSON that carries its option definitions in its type. */
export type ChatInputData<Options extends OptionRecord> =
  RESTPostAPIChatInputApplicationCommandsJSONBody & WithOptions<Options>;
