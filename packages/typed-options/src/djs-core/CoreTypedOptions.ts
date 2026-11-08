import type { OptionsOf } from '../base/definition/OptionsOf.js';
import type { TypedOptions } from '../base/typed/TypedOptions.js';
import type { CoreValues } from './CoreValues.js';

/** The typed options of command (or subcommand) data over raw API payloads. */
export type CoreTypedOptions<Data> = TypedOptions<OptionsOf<Data>, CoreValues>;
