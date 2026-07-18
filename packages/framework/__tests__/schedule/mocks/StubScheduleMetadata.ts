import type { Metadata, MetadataFactory } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubScheduleMetadata {
  static create(): MetadataFactory {
    return {
      createOrPopulate: vi.fn(
        (meta: Metadata | undefined, id: symbol) =>
          meta ?? ({ [id.toString()]: {} } as Metadata),
      ),
      addDefaultField: vi.fn(),
      getFields: vi.fn().mockReturnValue([]),
    } as unknown as MetadataFactory;
  }
}
