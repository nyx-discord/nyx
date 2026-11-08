import type { NoOptions } from './NoOptions.js';
import type { WithOptions } from './WithOptions.js';

/** Extracts the option definitions out of data that carries them. */
export type OptionsOf<Data> =
  Data extends WithOptions<infer Options>
    ? Exclude<Options, undefined>
    : NoOptions;
