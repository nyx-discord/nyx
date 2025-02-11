import type { CustomIdCodec } from '@nyx-discord/core';
import type { DuplexBuffer } from '@sapphire/string-store';
import { Pointer, UnalignedUint16Array } from '@sapphire/string-store';

type SchemaLike<Serialized> = {
  id: number;
  serialize: (data: Serialized) => string;
  deserialize: (buffer: DuplexBuffer, pointer: Pointer) => Serialized | null;
};

export abstract class AbstractCustomIdCodec<Serialized>
  implements CustomIdCodec<Serialized>
{
  protected abstract readonly schema: SchemaLike<Serialized>;

  public serialize(data: Serialized): string {
    return this.schema.serialize(data);
  }

  public deserialize(customId: string): Serialized | null {
    const buffer = UnalignedUint16Array.from(customId);
    const pointer = new Pointer();

    const feature = buffer.readInt16(pointer);
    if (feature !== this.schema.id) {
      return null;
    }

    return this.schema.deserialize(buffer, pointer);
  }
}
