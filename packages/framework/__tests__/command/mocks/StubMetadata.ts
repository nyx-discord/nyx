import type { Metadata } from '@nyx-discord/core';

export class StubMetadata {
  static create(): Metadata {
    return {} as Metadata;
  }
}
