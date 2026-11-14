// Schedules with @discordjs/core: same as discord.js, but use the REST/gateway APIs.
// Docs: https://nyx-discord.github.io/nyx/guide/use/schedules.md
import { ActivityType, PresenceUpdateStatus } from '@discordjs/core';
import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/djs-core';

export class PresenceSchedule extends AbstractSchedule {
  protected readonly interval = '*/30 * * * *';

  public async tick(meta: Metadata) {
    // TypedFields.getClient(meta) is the gateway Client, which presences need; TypedFields.getBot(meta) gives the CoreBot.
    const client = TypedFields.getClient(meta);

    const guilds = await client.api.users.getGuilds({ with_counts: true });
    const members = guilds.reduce((total, guild) => total + (guild.approximate_member_count ?? 0), 0);

    await client.updatePresence(0, {
      since: null,
      afk: false,
      status: PresenceUpdateStatus.Online,
      activities: [{ name: `${members} members`, type: ActivityType.Watching }],
    });
  }
}
