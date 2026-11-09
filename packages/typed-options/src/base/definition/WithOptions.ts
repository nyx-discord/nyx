import type { OptionRecord } from './OptionRecord.js';

declare const optionsBrand: unique symbol;

/** Brands command data with its option definitions */
export interface WithOptions<Options extends OptionRecord> {
  readonly [optionsBrand]?: Options;
}
