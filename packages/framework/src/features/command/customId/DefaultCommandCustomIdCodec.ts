import type {
  CommandCustomIdCodec,
  CommandCustomIdData,
} from '@nyx-discord/core';
import { Schema, t } from '@sapphire/string-store';
import { AbstractCustomIdCodec } from '../../../customId/AbstractCustomIdCodec';
import { SerializableFeatureEnum } from '../../../customId/SerializableFeatureEnum';

export class DefaultCommandCustomIdCodec
  extends AbstractCustomIdCodec<CommandCustomIdData>
  implements CommandCustomIdCodec
{
  protected override readonly schema = new Schema(
    SerializableFeatureEnum.Command,
  )
    // Currently technically a uint2 is just the enough size, but I'm making it 4 for future-proofing
    .uint4('type')
    .string('name')
    .nullable('extra', t.string)
    .nullable('subcommand', t.string)
    .nullable(
      'group',
      t.string,
      // The union makes this not match the schema, type asserting here
    ) as AbstractCustomIdCodec<CommandCustomIdData>['schema'];

  public static create(): CommandCustomIdCodec {
    return new DefaultCommandCustomIdCodec();
  }
}
