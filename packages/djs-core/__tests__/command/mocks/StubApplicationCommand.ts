import type { APIApplicationCommand } from '@discordjs/core';
import { ApplicationCommandType } from '@discordjs/core';

export class StubApplicationCommand {
  public static create(
    name: string,
    type: ApplicationCommandType = ApplicationCommandType.ChatInput,
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
      default_member_permissions: '',
      ...(guild_id ? { guild_id } : {}),
    };
  }
}
