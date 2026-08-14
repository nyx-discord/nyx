import type { NyxClient } from '@nyx-discord/types';
import type { Client } from 'discord.js';

/** A {@link NyxClient} backed by a discord.js {@link Client}. */
export class DjsNyxClient implements NyxClient<Client> {
  protected readonly client: Client;

  protected readonly token: string;

  constructor(client: Client, token: string) {
    this.client = client;
    this.token = token;
  }

  public getEmitter(): Client {
    return this.client;
  }

  public async login(): Promise<void> {
    await this.client.login(this.token);
  }

  public destroy(): Promise<void> {
    return this.client.destroy();
  }
}
