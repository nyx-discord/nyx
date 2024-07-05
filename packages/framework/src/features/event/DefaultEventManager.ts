/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import type {
  AnyEventBus,
  ClassImplements,
  EventBus,
  EventManager,
  EventManagerEventsArgs,
  EventSubscriber,
  Identifier,
  NyxBot,
} from '@nyx-discord/core';
import {
  AssertionError,
  canBeIdentifier,
  EventManagerEventEnum,
  IllegalDuplicateError,
  LockedObjectError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { Awaitable, Client, ClientEvents } from 'discord.js';

import { BasicEventBus } from './bus/BasicEventBus.js';
import { BasicEventEmitterBus } from './bus/BasicEventEmitterBus.js';

type EventManagerOptions = {
  managerBus: EventBus<EventManagerEventsArgs>;
  clientBus: EventBus<ClientEvents>;
};

export class DefaultEventManager implements EventManager {
  public readonly bot: NyxBot;

  protected readonly buses: Collection<Identifier, AnyEventBus>;

  protected readonly managerBus: EventBus<EventManagerEventsArgs>;

  protected readonly clientBus: EventBus<ClientEvents>;

  constructor(bot: NyxBot, options: EventManagerOptions) {
    this.bot = bot;
    this.managerBus = options.managerBus;
    this.clientBus = options.clientBus;
    this.buses = new Collection<Identifier, AnyEventBus>();

    this.managerBus.lock();
    this.clientBus.lock();
  }

  public static create(
    bot: NyxBot,
    client: Client,
    options?: Partial<EventManagerOptions>,
  ): EventManager {
    const constructorOptions = options ?? {};

    if (!constructorOptions.managerBus) {
      const managerBusId = Symbol('EventManagerEventBus');
      constructorOptions.managerBus =
        BasicEventBus.createAsync<EventManagerEventsArgs>(bot, managerBusId);
    }

    if (!constructorOptions.clientBus) {
      const clientBusId = Symbol('ClientEventBus');
      constructorOptions.clientBus = BasicEventEmitterBus.createSyncWithEmitter<
        ClientEvents,
        Client
      >(bot, clientBusId, client);
    }

    return new DefaultEventManager(
      bot,
      constructorOptions as EventManagerOptions,
    );
  }

  public onStart(): Awaitable<void> {
    /** Do nothing by default */
  }

  public async onSetup(): Promise<void> {
    await this.managerBus.onRegister();
    await this.clientBus.onRegister();
  }

  public async onStop(): Promise<void> {
    for (const bus of this.buses.values()) {
      await bus.onUnregister();
      this.buses.delete(bus.getId());
    }

    await this.managerBus.onUnregister();
    await this.clientBus.onUnregister();
  }

  public async addEventBuses(...buses: AnyEventBus[]): Promise<this> {
    for (const bus of buses) {
      const botBus = bus.getBot();
      if (botBus && botBus !== this.bot) {
        throw new AssertionError(
          `Bus '${String(bus.getId())}' is not from this bot.`,
        );
      }

      const id = bus.getId();
      const presentBus = this.buses.get(id);
      if (presentBus) {
        throw new IllegalDuplicateError(
          presentBus,
          bus,
          `Bus '${String(id)}' is already registered.`,
        );
      }

      this.buses.set(id, bus);

      await bus.onRegister();

      Promise.resolve(
        this.managerBus.emit(EventManagerEventEnum.EventBusAdd, [bus]),
      ).catch((error) => {
        this.bot.logger.error(
          `Uncaught bus error while emitting bus add of '${String(id)}'.`,
          error,
        );
      });
    }

    return this;
  }

  public async removeEventBus(
    eventBusOrId: Identifier | AnyEventBus,
  ): Promise<this> {
    const id = canBeIdentifier(eventBusOrId)
      ? eventBusOrId
      : eventBusOrId.getId();

    const presentBus = this.buses.get(id);
    if (!presentBus) {
      throw new ObjectNotFoundError(
        `EventBus with ID '${String(id)}' not found.`,
      );
    }

    if (presentBus.isLocked()) {
      throw new LockedObjectError(presentBus);
    }

    await presentBus.clearSubscribers(undefined, true);
    this.buses.delete(id);

    await presentBus.onUnregister();

    Promise.resolve(
      this.managerBus.emit(EventManagerEventEnum.EventBusRemove, [presentBus]),
    ).catch((error) => {
      const busId = String(presentBus.getId());

      this.bot.logger.error(
        `Uncaught bus error while emitting event bus remove '${busId}'.`,
        error,
      );
    });

    return this;
  }

  public getBus<const Bus extends AnyEventBus>(
    eventBusOrId: Identifier | Bus,
  ): Bus | null {
    const id = canBeIdentifier(eventBusOrId)
      ? eventBusOrId
      : eventBusOrId.getId();
    return (this.buses.get(id) as Bus) ?? null;
  }

  public isBusRegistered(eventBusOrId: Identifier | AnyEventBus): boolean {
    const id = canBeIdentifier(eventBusOrId)
      ? eventBusOrId
      : eventBusOrId.getId();
    return this.buses.has(id);
  }

  public async subscribeClient(
    ...subscribers: EventSubscriber<ClientEvents, keyof ClientEvents>[]
  ): Promise<this> {
    await this.clientBus.subscribe(...subscribers);
    return this;
  }

  public async subscribeManager(
    ...subscribers: EventSubscriber<
      EventManagerEventsArgs,
      keyof EventManagerEventsArgs
    >[]
  ): Promise<this> {
    await this.managerBus.subscribe(...subscribers);
    return this;
  }

  public getManagerBus(): EventBus<EventManagerEventsArgs> {
    return this.managerBus;
  }

  public getClientBus(): EventBus<ClientEvents> {
    return this.clientBus;
  }

  public getBuses(): ReadonlyCollection<Identifier, AnyEventBus> {
    return this.buses;
  }

  public getBusByClass<const BusClass extends ClassImplements<AnyEventBus>>(
    BusClass: BusClass,
  ): InstanceType<BusClass> | null {
    return (
      (this.buses.find(
        (bus) => bus instanceof BusClass,
      ) as InstanceType<BusClass>) ?? null
    );
  }
}
