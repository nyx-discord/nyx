import type { SessionCustomIdData } from '../../types/customId/data/SessionCustomIdData.js';
import type { SessionCustomIdCodec } from '../../types/customId/SessionCustomIdCodec.js';
import {
  AbstractCustomIdCodec,
  SerializableFeatureEnum,
} from '@nyx-discord/base';
import { Schema, t } from '@sapphire/string-store';

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
