import type { Metadata, MetadataFactory } from '../../../src';
import { vi } from 'vitest';

export class StubScheduleMetadata {
  public static create(): MetadataFactory {
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
