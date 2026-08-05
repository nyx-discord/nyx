import type { Metadata, MetadataFactory } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubEventMetadata {
  public static create(): MetadataFactory {
    return {
      createOrPopulate: vi.fn(
        (meta: Metadata | undefined, id: symbol) =>
          meta ?? ({ [id]: {} } as Metadata),
      ),
      addDefaultField: vi.fn(),
    } as unknown as MetadataFactory;
  }
}
