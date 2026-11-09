import type { Metadata } from '@nyx-discord/base';

export class StubMetadata {
  public static create(): Metadata {
    return Object.create(null) as Metadata;
  }
}
