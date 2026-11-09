import type { APIApplicationCommandBasicOption } from 'discord-api-types/v10';
import type { OptionRecord } from '../definition/OptionRecord.js';

export function toApiOptions(
  options: OptionRecord,
): APIApplicationCommandBasicOption[] {
  return Object.entries(options).map(
    ([name, def]) => ({ ...def, name }) as APIApplicationCommandBasicOption,
  );
}
