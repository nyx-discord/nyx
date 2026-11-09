import type { Metadata } from '#types/meta/Metadata';

export class StubMetadata {
  public static create(): Metadata {
    return Object.create(null) as Metadata;
  }
}
