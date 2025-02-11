import type {
  SessionCustomIdCodec,
  SessionCustomIdData,
} from '@nyx-discord/core';
import { Schema, t } from '@sapphire/string-store';
import { AbstractCustomIdCodec } from '../../../customId/AbstractCustomIdCodec';
import { SerializableFeatureEnum } from '../../../customId/SerializableFeatureEnum';

export class DefaultSessionCustomIdCodec
  extends AbstractCustomIdCodec<SessionCustomIdData>
  implements SessionCustomIdCodec
{
  protected override readonly schema = new Schema(
    SerializableFeatureEnum.Session,
  )
    .string('id')
    .nullable('extra', t.string)
    .nullable('page', t.uint2);

  public static create(): SessionCustomIdCodec {
    return new DefaultSessionCustomIdCodec();
  }
}
