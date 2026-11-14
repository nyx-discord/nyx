// A task that runs on an interval: a cron string, a number of milliseconds, or a Date.
// Docs: https://nyx-discord.github.io/nyx/guide/use/schedules.md
import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/djs';

export class PresenceSchedule extends AbstractSchedule {
  protected readonly interval = '*/30 * * * *'; // Every 30 minutes.

  public async tick(meta: Metadata) {
    // The discord.js Client of the bot that ticked this schedule; TypedFields.getBot(meta) gives the DjsBot.
    const client = TypedFields.getClient(meta);
    if (!client.user) return;

    const members = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
    client.user.setActivity(`${members} members`);
  }
}

export class CleanupSchedule extends AbstractSchedule {
  protected readonly interval = 60_000; // Every minute.

  public async tick() {
    // Call your own services here. Schedules aren't persisted: nyx keeps them in memory only.
  }
}
