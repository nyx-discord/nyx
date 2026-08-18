import type { NyxClient } from '@nyx-discord/types';
import type { Client } from 'discord.js';

/** A {@link NyxClient} backed by a discord.js {@link Client}. */
export class DjsNyxClient implements NyxClient<Client> {
  protected readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public getEmitter(): Client {
    return this.client;
  }

  public async login(): Promise<void> {
    await this.client.login();
  }

  public destroy(): Promise<void> {
    return this.client.destroy();
  }
}
