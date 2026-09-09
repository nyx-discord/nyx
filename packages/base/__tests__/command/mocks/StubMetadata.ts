import type { Metadata } from '@nyx-discord/types';

export class StubMetadata {
  public static create(): Metadata {
    return {} as Metadata;
  }
}
