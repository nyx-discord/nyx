import type { APIApplicationCommand } from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';

export class StubApplicationCommand {
  public static create(
    name: string,
    type: number = ApplicationCommandType.ChatInput,
    id = 'cmd-id',
    guild_id?: string,
    applicationId = 'test-app-id',
  ): APIApplicationCommand {
    return {
      id,
      application_id: applicationId,
      name,
      description: 'Mock description',
      type,
      version: '1',
      ...(guild_id ? { guild_id } : {}),
    } as APIApplicationCommand;
  }
}
