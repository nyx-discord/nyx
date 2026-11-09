import type { API, Client } from '@discordjs/core';
import type { WebSocketManager } from '@discordjs/ws';
import type { CoreClient } from './CoreClient.js';

/** A {@link CoreClient} backed by a @discordjs/core gateway {@link Client}. */
export class CoreNyxClient implements CoreClient<Client> {
  protected readonly client: Client;

  protected readonly gateway: WebSocketManager;

  protected readonly applicationId: string;

  constructor(
    client: Client,
    gateway: WebSocketManager,
    applicationId: string,
  ) {
    this.client = client;
    this.gateway = gateway;
    this.applicationId = applicationId;
  }

  public login(): Promise<void> {
    return this.gateway.connect();
  }

  public destroy(): Promise<void> {
    return Promise.resolve(this.gateway.destroy());
  }

  public getEmitter(): Client {
    return this.client;
  }

  public getApi(): API {
    return this.client.api;
  }

  public getApplicationId(): string {
    return this.applicationId;
  }
}
