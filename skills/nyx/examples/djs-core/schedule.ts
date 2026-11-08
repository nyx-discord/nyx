// Schedules with @discordjs/core: same as discord.js, but use TypedFields.CoreBot and the REST/gateway APIs.
// Docs: https://nyx-discord.github.io/nyx/guide/use/schedules.md
import { ActivityType, PresenceUpdateStatus } from '@discordjs/core';
import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/djs-core';

export class PresenceSchedule extends AbstractSchedule {
  protected readonly interval = '*/30 * * * *';

  public async tick(meta: Metadata) {
    // TypedFields.GatewayCoreBot types the client as the gateway CoreNyxClient, which presences need.
    // TypedFields.CoreBot types it as the CoreClient interface; TypedFields.Bot is the adapter-agnostic NyxBot.
    const bot = TypedFields.GatewayCoreBot.get(meta, true);
    const client = bot.getClient();

    const guilds = await client.getApi().users.getGuilds({ with_counts: true });
    const members = guilds.reduce((total, guild) => total + (guild.approximate_member_count ?? 0), 0);

    await client.getEmitter().updatePresence(0, {
      since: null,
      afk: false,
      status: PresenceUpdateStatus.Online,
      activities: [{ name: `${members} members`, type: ActivityType.Watching }],
    });
  }
}
