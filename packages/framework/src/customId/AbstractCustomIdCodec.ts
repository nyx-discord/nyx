import type { CustomIdBuilder, CustomIdCodec } from '@nyx-discord/core';
import {
  AssertionError,
  MetadatableCustomIdBuilder,
  StringIterator,
} from '@nyx-discord/core';

export abstract class AbstractCustomIdCodec<Serialized>
  implements CustomIdCodec<Serialized>
{
  public static readonly DefaultSeparator: string = '႞';

  public static readonly DefaultMetadataSeparator: string = '୵';

  protected readonly namespace: string;

  protected readonly separator: string;

  protected readonly metadataSeparator: string;

  constructor(namespace: string, separator: string, metadataSeparator: string) {
    if (separator === metadataSeparator) {
      throw new AssertionError(
        'The metadata separator cannot be the same as the string separator.',
      );
    }

    this.namespace = namespace;
    this.separator = separator;
    this.metadataSeparator = metadataSeparator;
  }

  public serializeToCustomId(serialized: Serialized): string {
    return this.createCustomIdBuilder(serialized).build();
  }

  public createCustomIdBuilder(serialized: Serialized): CustomIdBuilder {
    const id = this.getIdOf(serialized);

    return new MetadatableCustomIdBuilder({
      namespace: this.namespace,
      objectId: id,
      metadataSeparator: this.metadataSeparator,
      separator: this.separator,
    });
  }

  public createIteratorFromCustomId(customId: string): StringIterator | null {
    const builder = MetadatableCustomIdBuilder.fromMetadatableString(
      customId,
      this.separator,
      this.metadataSeparator,
    );

    if (!builder || builder.getNamespace() !== this.namespace) return null;

    const [...tokens] = builder.getTokens();

    return new StringIterator(tokens);
  }

  public deserializeToObjectId(customId: string): string | null {
    const builder = MetadatableCustomIdBuilder.fromMetadatableString(
      customId,
      this.separator,
      this.metadataSeparator,
    );

    if (!builder || builder.getNamespace() !== this.namespace) return null;

    return builder ? builder.getObjectId() : null;
  }

  /** Extracts the ID from the serialized object. */
  protected abstract getIdOf(serialized: Serialized): string;
}
