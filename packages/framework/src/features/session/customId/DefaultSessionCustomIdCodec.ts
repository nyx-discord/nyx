import type {
  SessionCustomIdCodec,
  SessionCustomIdData,
} from '@nyx-discord/core';

export class DefaultSessionCustomIdCodec implements SessionCustomIdCodec {
  // https://www.compart.com/en/unicode/U+001F
  protected static readonly Separator = String.fromCharCode(0x1f);

  protected static readonly Id = 'S';

  public static create(): SessionCustomIdCodec {
    return new DefaultSessionCustomIdCodec();
  }

  public serialize(data: SessionCustomIdData): string {
    const parts = [
      DefaultSessionCustomIdCodec.Id,
      data.id,
      data.page !== null ? data.page : '',
      data.extra !== null ? data.extra : '',
    ];
    return parts.join(DefaultSessionCustomIdCodec.Separator);
  }

  public deserialize(customId: string): SessionCustomIdData | null {
    const parts = customId.split(DefaultSessionCustomIdCodec.Separator);
    if (parts.length !== 4 || parts[0] !== DefaultSessionCustomIdCodec.Id) {
      return null;
    }

    const id = parts[1];
    if (!id) {
      return null;
    }
    const page = parts[2] ? parseInt(parts[2], 10) : null;
    if (page && isNaN(page)) {
      return null;
    }
    const extra = parts[3] || null;

    return {
      id,
      page,
      extra,
    };
  }
}
