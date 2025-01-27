import type { ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable, ClientEvents } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { Identifier } from '../../identity/Identifier.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { ClassImplements } from '../../types/ClassImplements.js';
import type { AnyEventBus } from './bus/AnyEventBus';
import type { EventBus } from './bus/EventBus.js';
import type { EventManagerEventsArgs } from './events/EventManagerEvent.js';
import type { EventSubscriber } from './subscriber/EventSubscriber.js';

/** An object that holds the objects and methods that make together a bot's event system. */
export interface EventManager extends BotAware, BotLifecycleObserver {
  /**
   * Adds event buses to the manager.
   *
   * @emits EventManagerEventEnum#EventBusAdd For each bus, on the manager's event bus.
   * @throws {AssertionError}        If the bus does not belong to the same bot as this manager.
   * @throws {IllegalDuplicateError} If a bus with that ID is already registered.
   */
  addEventBuses(...buses: AnyEventBus[]): Awaitable<this>;

  /**
   * Removes an event bus from the manager.
   *
   * @emits EventManagerEventEnum#EventBusRemove On the manager's event bus.
   * @throws {LockedObjectError}     If the bus is locked.
   * @throws {IllegalDuplicateError} If a bus with that ID is not registered.
   */
  removeEventBus(busOrId: AnyEventBus | Identifier): Awaitable<this>;

  /** Returns the registered EventBus that corresponds to the given ID or instance. */
  getBus<const Bus extends AnyEventBus>(busOrId: Identifier | Bus): Bus | null;

  /** Returns whether an event bus with the given ID or instance is registered. */
  isBusRegistered(eventBusOrId: Identifier | AnyEventBus): boolean;

  /** Returns the first registered EventBus that is an instance of the given class. */
  getBusByClass<const BusClass extends ClassImplements<AnyEventBus>>(
    BusClass: BusClass,
  ): InstanceType<BusClass> | null;

  /**
   * Subscribes a list of event subscribers to the Client bus.
   *
   * Alias of:
   * ```
   * const clientBus = eventManager.getClientBus();
   * await clientBus.subscribe(subscriber);
   * ```
   */
  subscribeClient(
    ...subscribers: EventSubscriber<ClientEvents, keyof ClientEvents>[]
  ): Awaitable<this>;

  /**
   * Subscribes a list of event subscribers to the manager's bus.
   *
   * Alias of:
   * ```
   * const managerBus = eventManager.getManagerBus();
   * await managerBus.subscribe(subscriber);
   * ```
   */
  subscribeManager(
    ...subscribers: EventSubscriber<
      EventManagerEventsArgs,
      keyof EventManagerEventsArgs
    >[]
  ): Awaitable<this>;

  /** Returns the bot's Discord.js Client event bus. */
  getClientBus(): EventBus<ClientEvents>;

  /** Returns the EventManager's event bus. */
  getManagerBus(): EventBus<EventManagerEventsArgs>;

  /** Returns a readonly collection of the currently stored event buses. */
  getBuses(): ReadonlyCollection<Identifier, AnyEventBus>;
}
