import type { Identifiable } from '@nyx-discord/core';

import { AbstractCustomIdCodec } from './AbstractCustomIdCodec';

export class IdentifiableCustomIdCodec<
  Serialized extends Identifiable<string>,
> extends AbstractCustomIdCodec<Serialized> {
  /** @inheritDoc */
  protected getIdOf(serialized: Serialized): string {
    return serialized.getId();
  }
}
