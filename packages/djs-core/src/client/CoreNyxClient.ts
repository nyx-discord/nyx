import type { NyxClient } from '@nyx-discord/types';
import type { API, Client } from '@discordjs/core';
import type { WebSocketManager } from '@discordjs/ws';

/** A {@link NyxClient} backed by a @discordjs/core {@link Client}. */
export class CoreNyxClient implements NyxClient<Client> {
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

  public getEmitter(): Client {
    return this.client;
  }

  public login(): Promise<void> {
    return this.gateway.connect();
  }

  public destroy(): Promise<void> {
    return Promise.resolve(this.gateway.destroy());
  }

  /** Returns the @discordjs/core REST API. */
  public getApi(): API {
    return this.client.api;
  }

  /** Returns the bot's application ID. */
  public getApplicationId(): string {
    return this.applicationId;
  }
}
