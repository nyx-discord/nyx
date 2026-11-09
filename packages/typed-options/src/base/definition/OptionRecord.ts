import type { APIApplicationCommandBasicOption } from 'discord-api-types/v10';

/** Any option definition, as created by the option helpers: an API option minus its name. */
type OptionDef = APIApplicationCommandBasicOption extends infer Option
  ? Option extends unknown
    ? Omit<Option, 'name'>
    : never
  : never;

/** Option definitions keyed by option name. */
export type OptionRecord = Readonly<Record<string, OptionDef>>;
