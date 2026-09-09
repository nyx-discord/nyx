import { ApplicationCommandType } from 'discord-api-types/v10';
import type { ApplicationCommand } from 'discord.js';

export class StubApplicationCommand {
  public static create(
    name: string,
    type: number = ApplicationCommandType.ChatInput,
    id = 'cmd-id',
  ): ApplicationCommand {
    return {
      id,
      name,
      type,
    } as unknown as ApplicationCommand;
  }
}
