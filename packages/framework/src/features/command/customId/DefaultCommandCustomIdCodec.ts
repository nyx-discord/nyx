import type {
  AnyExecutableCommand,
  CommandCustomIdCodec,
} from '@nyx-discord/core';

import { AbstractCustomIdCodec } from '../../../customId/AbstractCustomIdCodec';

export class DefaultCommandCustomIdCodec
  extends AbstractCustomIdCodec<AnyExecutableCommand>
  implements CommandCustomIdCodec
{
  public static readonly DefaultNamespace = 'CMD';

  public static readonly DefaultNamesSeparator = ':';

  protected readonly namesSeparator: string;

  constructor(
    prefix: string = DefaultCommandCustomIdCodec.DefaultNamespace,
    separator: string = DefaultCommandCustomIdCodec.DefaultSeparator,
    metadataSeparator: string = DefaultCommandCustomIdCodec.DefaultMetadataSeparator,
    namesSeparator: string = DefaultCommandCustomIdCodec.DefaultNamesSeparator,
  ) {
    super(prefix, separator, metadataSeparator);

    this.namesSeparator = namesSeparator;
  }

  public static create(): CommandCustomIdCodec {
    return new DefaultCommandCustomIdCodec();
  }

  public getNameTreeFromId(id: string): [string, ...string[]] {
    return id.split(this.namesSeparator) as [string, ...string[]];
  }

  public deserializeToNameTree(customId: string): [string, ...string[]] | null {
    const id = this.deserializeToObjectId(customId);
    if (!id) return null;

    return this.getNameTreeFromId(id);
  }

  /** @inheritDoc */
  protected getIdOf(serialized: AnyExecutableCommand): string {
    return serialized.getNameTree().join(this.namesSeparator);
  }
}
