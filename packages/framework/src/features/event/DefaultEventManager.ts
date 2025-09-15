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
  canBeIdentifier,
  EventManagerEventEnum,
  IllegalDuplicateError,
  ObjectNotFoundError,
  ProtectedObjectError,
  TypedFields,
} from '@nyx-discord/core';
import type { Awaitable, Client, ClientEvents } from 'discord.js';
import { DefaultMetaCollectionFactory } from '../../meta/DefaultMetaCollectionFactory.js';
import { ensureKey } from '../../util/ensureKey.js';
import { BasicEventBus } from './bus/BasicEventBus.js';
import { BasicEventEmitterBus } from './bus/BasicEventEmitterBus.js';

type EventManagerOptions = {
  managerBus: EventBus<EventManagerEventsArgs>;
  clientBus: EventBus<ClientEvents>;
};

export class DefaultEventManager implements EventManager {
  protected readonly buses: Collection<Identifier, AnyEventBus>;

  protected readonly managerBus: EventBus<EventManagerEventsArgs>;

  protected readonly clientBus: EventBus<ClientEvents>;

  constructor(options: EventManagerOptions) {
    this.managerBus = options.managerBus;
    this.clientBus = options.clientBus;
    this.buses = new Collection<Identifier, AnyEventBus>();
    this.managerBus.protect();
    this.clientBus.protect();
  }

  public static create(options: {
    bot: NyxBot;
    client: Client;
    injections?: Partial<EventManagerOptions>;
  }): EventManager {
    const constructorOptions = options.injections ?? {};
    const metaFactory = DefaultMetaCollectionFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

    ensureKey(
      constructorOptions,
      'managerBus',
      BasicEventBus.createAsync<EventManagerEventsArgs>(
        Symbol('EventManagerEventBus'),
        metaFactory,
      ),
    );

    ensureKey(
      constructorOptions,
      'clientBus',
      BasicEventEmitterBus.createSyncWithEmitter<ClientEvents, Client>(
        Symbol('ClientEventBus'),
        options.client,
        metaFactory,
      ),
    );

    return new this(constructorOptions);
  }

  public onStart(): Awaitable<void> {
    /** Do nothing by default */
  }

  public onStop(): Awaitable<void> {
    for (const bus of this.buses.values()) {
      this.buses.delete(bus.getId());
    }
  }

  public async addEventBuses(...buses: AnyEventBus[]): Promise<this> {
    for (const bus of buses) {
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

      Promise.resolve(
        this.managerBus.emit(EventManagerEventEnum.EventBusAdd, [bus]),
      ).catch((_error) => {});
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

    if (presentBus.isProtected()) {
      throw new ProtectedObjectError(presentBus);
    }

    await presentBus.clearSubscribers(undefined, true);
    this.buses.delete(id);

    Promise.resolve(
      this.managerBus.emit(EventManagerEventEnum.EventBusRemove, [presentBus]),
    ).catch((_error) => {});

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
