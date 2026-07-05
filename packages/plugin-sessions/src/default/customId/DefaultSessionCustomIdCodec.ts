import {
  AbstractCustomIdCodec,
  SerializableFeatureEnum,
} from '@nyx-discord/framework';
import { Schema, t } from '@sapphire/string-store';
import type { SessionCustomIdData } from '../../core/customId/data/SessionCustomIdData';
import type { SessionCustomIdCodec } from '../../core/customId/SessionCustomIdCodec';

export class DefaultSessionCustomIdCodec
  extends AbstractCustomIdCodec<SessionCustomIdData>
  implements SessionCustomIdCodec
{
  protected override readonly schema = new Schema(
    SerializableFeatureEnum.Session,
  )
    .string('id')
    .nullable('extra', t.string)
    .nullable('page', t.uint8);

  public static create(): SessionCustomIdCodec {
    return new this();
  }
}
