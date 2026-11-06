import type { Metadata } from '#types/meta/Metadata';
import type { MetadataFactory } from '#types/meta/MetadataFactory';
import { vi } from 'vitest';

export class StubEventMetadata {
  public static create(): MetadataFactory {
    return {
      createOrPopulate: vi.fn(
        (meta: Metadata | undefined, id: symbol) =>
          meta ?? ({ [id]: {} } as Metadata),
      ),
      addDefaultField: vi.fn(),
      getFields: vi.fn().mockReturnValue([]),
    } as unknown as MetadataFactory;
  }
}
