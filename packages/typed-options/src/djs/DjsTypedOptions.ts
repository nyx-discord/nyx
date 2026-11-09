import type { OptionsOf } from '../base/definition/OptionsOf.js';
import type { TypedOptions } from '../base/typed/TypedOptions.js';
import type { DjsValues } from './DjsValues.js';

/** The typed options of command (or subcommand) data over discord.js. */
export type DjsTypedOptions<Data> = TypedOptions<OptionsOf<Data>, DjsValues>;
