import type { ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { Identifier } from '../../identity/Identifier.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { ClassImplements } from '../../types/ClassImplements.js';
import type { EventBus } from '../event/bus/EventBus.js';
import type { EventSubscriber } from '../event/subscriber/EventSubscriber';
import type { PluginEventArgs } from './events/PluginEvent.js';
import type { NyxPlugin } from './plugin/NyxPlugin.js';

/** An object that holds the objects and methods that make together a bot's plugin system. */
export interface PluginManager
  extends BotAware,
    BotLifecycleObserver,
    IterableIterator<[Identifier, NyxPlugin]> {
  /**
   * Registers a list of plugins.
   *
   * @throws {IllegalDuplicateError} If a plugin with that ID is already
   *   registered.
   */
  register(...plugins: NyxPlugin[]): Awaitable<this>;

  /**
   * Unregisters a plugin given its instance or ID.
   *
   * @throws {ObjectNotFoundError} If the plugin is not registered.
   */
  unregister(pluginOrId: NyxPlugin | Identifier): Awaitable<this>;

  /**
   * Subscribes a list of event subscribers to the manager's bus.
   *
   * Alias of:
   * ```
   * const managerBus = pluginManager.getEventBus();
   * await managerBus.subscribe(subscriber);
   * ```
   */
  subscribe(
    ...subscribers: EventSubscriber<PluginEventArgs, keyof PluginEventArgs>[]
  ): Awaitable<this>;

  /** Returns a plugin by its ID. */
  getPluginById(id: Identifier): NyxPlugin | null;

  /** Returns the first plugin that is an instance of the passed class. */
  getPluginByClass(
    PluginClass: ClassImplements<NyxPlugin>,
  ): InstanceType<typeof PluginClass> | null;

  /** Returns the {@link EventBus} for this manager. */
  getEventBus(): EventBus<PluginEventArgs>;

  /** Returns all registered plugins. */
  getPlugins(): ReadonlyCollection<Identifier, NyxPlugin>;

  /** Returns an iterator of all {@link NyxPlugin}s. */
  values(): IterableIterator<NyxPlugin>;

  /** Returns an iterator of all {@link Identifier}s. */
  keys(): IterableIterator<Identifier>;

  /** Returns an iterator of all [{@link Identifier}, {@link NyxPlugin}] pairs. */
  entries(): IterableIterator<[Identifier, NyxPlugin]>;
}
