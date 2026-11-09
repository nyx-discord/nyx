/** An object responsible for creating and manipulating customIds that refer to objects. */
export interface CustomIdCodec<Serialized> {
  /** Serializes a {@link Serialized} into a customId. */
  serialize(data: Serialized): string;
  /** Deserializes a customId into a {@link Serialized}, if possible. */
  deserialize(customId: string): Serialized | null;
}
