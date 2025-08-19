import type {
  CommandCustomIdCodec,
  CommandCustomIdData,
} from '@nyx-discord/core';
import type { ApplicationCommandType } from 'discord.js';

export class DefaultCommandCustomIdCodec implements CommandCustomIdCodec {
  // https://www.compart.com/en/unicode/U+001F
  protected static readonly Separator = String.fromCharCode(0x1f);

  protected static readonly Id = 'C';

  public static create(): CommandCustomIdCodec {
    return new DefaultCommandCustomIdCodec();
  }

  public serialize(data: CommandCustomIdData): string {
    const parts = [
      DefaultCommandCustomIdCodec.Id,
      data.type,
      data.name,
      data.subcommand,
      data.group,
      data.extra !== null ? data.extra : '',
    ];
    return parts.join(DefaultCommandCustomIdCodec.Separator);
  }

  public deserialize(customId: string): CommandCustomIdData | null {
    const parts = customId.split(DefaultCommandCustomIdCodec.Separator);
    if (parts.length !== 6 || parts[0] !== DefaultCommandCustomIdCodec.Id) {
      return null;
    }

    const id = parts[1];
    if (!id) {
      return null;
    }
    const typeString = parts[2];
    if (!typeString) {
      return null;
    }
    const type: ApplicationCommandType = parseInt(typeString, 10);
    if (isNaN(type)) {
      return null;
    }

    const name = parts[3];
    if (!name) {
      return null;
    }

    const subcommand = parts[4] || null;
    const group = parts[5] || null;
    const extra = parts[6] || null;

    return {
      type,
      name,
      subcommand,
      group,
      extra,
    } as CommandCustomIdData;
  }
}
